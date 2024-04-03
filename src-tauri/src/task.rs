use crate::consts::EmitEvent;
use crate::error::Result;
use crate::event::PostEvent;
use crate::session_store::TauriPluginStore;
use atrium_api::agent::AtpAgent;
use atrium_api::types::Union;
use atrium_xrpc_client::reqwest::ReqwestClient;
use std::collections::{HashMap, HashSet};
use std::sync::Arc;
use std::time::Duration;
use tauri::{Manager, Runtime};

pub async fn poll_feed<R: Runtime>(
    uri: Option<String>,
    agent: Arc<AtpAgent<TauriPluginStore<R>, ReqwestClient>>,
    mut receiver: tokio::sync::oneshot::Receiver<()>,
    app: tauri::AppHandle<R>,
) -> Result<()> {
    use atrium_api::app::bsky::feed::defs::{FeedViewPost, ReplyRefParentRefs};
    async fn fetch_posts<R: Runtime>(
        uri: &Option<String>,
        agent: &Arc<AtpAgent<TauriPluginStore<R>, ReqwestClient>>,
        app: &tauri::AppHandle<R>,
        cids: &mut HashMap<String, FeedViewPost>,
    ) -> Result<()> {
        log::info!("fetch posts");
        let posts = if let Some(feed) = uri {
            agent
                .api
                .app
                .bsky
                .feed
                .get_feed(atrium_api::app::bsky::feed::get_feed::Parameters {
                    cursor: None,
                    feed: feed.into(),
                    limit: 30.try_into().ok(),
                })
                .await?
                .feed
        } else {
            agent
                .api
                .app
                .bsky
                .feed
                .get_timeline(atrium_api::app::bsky::feed::get_timeline::Parameters {
                    algorithm: None,
                    cursor: None,
                    limit: 30.try_into().ok(),
                })
                .await?
                .feed
        };
        for post in posts.iter().rev() {
            let cid = post.post.cid.as_ref().to_string();
            if let Some(prev) = cids.get(&cid) {
                if post.reason != prev.reason
                    || post.post.reply_count != prev.post.reply_count
                    || post.post.repost_count != prev.post.repost_count
                    || post.post.like_count != prev.post.like_count
                {
                    app.emit(EmitEvent::Post.as_ref(), PostEvent::Update(post.clone()))
                        .expect("failed to emit post event");
                }
            } else {
                if let Some(reply) = &post.reply {
                    if let Union::Refs(ReplyRefParentRefs::PostView(post_view)) = &reply.parent {
                        if let Some(prev) = cids.get(&post_view.cid.as_ref().to_string()) {
                            app.emit(
                                EmitEvent::Post.as_ref(),
                                PostEvent::Delete(prev.post.clone()),
                            )
                            .expect("failed to emit post event");
                        }
                    }
                }
                app.emit(EmitEvent::Post.as_ref(), PostEvent::Add(post.clone()))
                    .expect("failed to emit post event");
            }
            cids.insert(cid, post.clone());
        }
        Ok(())
    }
    let mut cids = HashMap::new();
    let mut interval = tokio::time::interval(Duration::from_secs(60));
    loop {
        tokio::select! {
            _ = &mut receiver => {
                break;
            }
            _ = interval.tick() => fetch_posts(&uri, &agent, &app, &mut cids).await?,
        }
    }
    Ok(())
}

pub async fn poll_notifications<R: Runtime>(
    agent: Arc<AtpAgent<TauriPluginStore<R>, ReqwestClient>>,
    mut receiver: tokio::sync::oneshot::Receiver<()>,
    app: tauri::AppHandle<R>,
) -> Result<()> {
    use atrium_api::app::bsky::notification::list_notifications::Parameters;
    async fn fetch_notifications<R: Runtime>(
        app: &tauri::AppHandle<R>,
        agent: &Arc<AtpAgent<TauriPluginStore<R>, ReqwestClient>>,
        cids: &mut HashSet<String>,
    ) -> Result<()> {
        log::info!("fetch notifications");
        let output = agent
            .api
            .app
            .bsky
            .notification
            .list_notifications(Parameters {
                cursor: None,
                limit: 30.try_into().ok(),
                seen_at: None,
            })
            .await?;
        for notification in output.notifications.iter().rev() {
            let cid = notification.cid.as_ref().to_string();
            if cids.contains(&cid) {
                continue;
            }
            cids.insert(cid);
            app.emit(EmitEvent::Notification.as_ref(), notification)
                .expect("failed to emit post event");
        }
        Ok(())
    }
    let mut cids = HashSet::new();
    let mut interval = tokio::time::interval(Duration::from_secs(60));
    loop {
        tokio::select! {
            _ = &mut receiver => {
                break;
            }
            _ = interval.tick() => fetch_notifications(&app, &agent, &mut cids).await?,
        }
    }
    Ok(())
}

pub async fn poll_unread_notifications<R: Runtime>(
    agent: Arc<AtpAgent<TauriPluginStore<R>, ReqwestClient>>,
    mut receiver: tokio::sync::oneshot::Receiver<()>,
    app: tauri::AppHandle<R>,
) -> Result<()> {
    use atrium_api::app::bsky::notification::list_notifications::Parameters;
    async fn fetch_notifications<R: Runtime>(
        agent: &Arc<AtpAgent<TauriPluginStore<R>, ReqwestClient>>,
        _: &tauri::AppHandle<R>,
    ) -> Result<()> {
        log::info!("fetch notifications");
        let output = agent
            .api
            .app
            .bsky
            .notification
            .list_notifications(Parameters {
                cursor: None,
                limit: 40.try_into().ok(),
                seen_at: None,
            })
            .await?;
        if let Some(seen_at) = output.seen_at {
            for notification in output.notifications.iter().rev() {
                if notification.indexed_at > seen_at {
                    // TODO: more filtering
                    log::info!("new notification: {notification:?}");
                    // notify(app, notification).expect("failed to notify");
                }
            }
        }
        Ok(())
    }
    let mut interval = tokio::time::interval(Duration::from_secs(30));
    loop {
        tokio::select! {
            _ = &mut receiver => {
                break;
            }
            _ = interval.tick() => fetch_notifications(&agent, &app).await?,
        }
    }
    Ok(())
}

// WIP
// fn notify<R: Runtime>(
//     app: &tauri::AppHandle<R>,
//     notification: &atrium_api::app::bsky::notification::list_notifications::Notification,
// ) -> std::result::Result<(), tauri_plugin_notification::Error> {
//     let author = notification.author.clone();
//     log::info!("handle: {:?}", author.handle.to_string());

//     let author_name = author
//         .display_name
//         .filter(|s| !s.is_empty())
//         .unwrap_or(author.handle.to_string());
//     log::info!("author name: {author_name}");
//     let title = match notification.reason.as_str() {
//         "like" => format!("{author_name} liked your post"),
//         "repost" => format!("{author_name} reposted your post"),
//         "follow" => format!("{author_name} followed your"),
//         "mention" => String::new(),
//         "reply" => String::new(),
//         "quote" => String::new(),
//         _ => unreachable!(),
//     };
//     let body = "test";
//     app.notification().builder().title(title).body(body).show()
// }
