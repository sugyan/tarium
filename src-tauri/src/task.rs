use crate::appdata::{get_appdata, set_appdata};
use crate::consts::{EmitEvent, SETTING_NOTIFICATION};
use crate::error::Result;
use crate::event::{NotificationEvent, PostEvent};
use crate::session::TauriPluginStore;
use crate::setting::STORE_SETTING_PATH;
use atrium_api::agent::AtpAgent;
use atrium_api::app::bsky::feed::defs::FeedViewPostReasonRefs;
use atrium_api::records::{KnownRecord, Record};
use atrium_api::types::Union;
use atrium_xrpc_client::reqwest::ReqwestClient;
use serde_json::{from_value, to_value};
use std::collections::{HashMap, HashSet};
use std::sync::Arc;
use std::time::Duration;
use tauri::{Emitter, Manager, Runtime};
use tauri_plugin_notification::NotificationExt;
use tauri_plugin_store::with_store;

const NOTIFIED_AT: &str = "notified_at";

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
                if post.reason != prev.reason {
                    // only update if reposted reason is newer
                    if match (&post.reason, &prev.reason) {
                        (Some(_), None) => true,
                        (
                            Some(Union::Refs(FeedViewPostReasonRefs::ReasonRepost(curr))),
                            Some(Union::Refs(FeedViewPostReasonRefs::ReasonRepost(prev))),
                        ) => curr.indexed_at > prev.indexed_at,
                        _ => false,
                    } {
                        app.emit(
                            EmitEvent::Post.as_ref(),
                            PostEvent::Delete(prev.post.clone()),
                        )?;
                        app.emit(EmitEvent::Post.as_ref(), PostEvent::Add(post.clone()))?;
                    }
                    // otherwise, skip saving to cids
                    else {
                        continue;
                    }
                } else if post != prev {
                    app.emit(EmitEvent::Post.as_ref(), PostEvent::Update(post.clone()))?;
                }
            } else {
                if let Some(reply) = &post.reply {
                    if let Union::Refs(ReplyRefParentRefs::PostView(post_view)) = &reply.parent {
                        if let Some(prev) = cids.get(&post_view.cid.as_ref().to_string()) {
                            app.emit(
                                EmitEvent::Post.as_ref(),
                                PostEvent::Delete(prev.post.clone()),
                            )?;
                        }
                    }
                }
                app.emit(EmitEvent::Post.as_ref(), PostEvent::Add(post.clone()))?;
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
            app.emit(EmitEvent::Notification.as_ref(), notification)?;
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
        app: &tauri::AppHandle<R>,
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
            let notified = get_appdata(app.clone(), NOTIFIED_AT.into())?
                .and_then(|value| from_value::<String>(value).ok())
                .and_then(|v| v.parse().ok())
                .unwrap_or(seen_at.clone());
            let mut count = 0;
            for notification in output.notifications.iter().rev() {
                if notification.indexed_at > seen_at {
                    // TODO: more filtering
                    count += 1;
                    log::info!("new notification: {}", notification.cid.as_ref());
                    if notification.indexed_at > notified {
                        tauri::async_runtime::spawn(notify(
                            agent.clone(),
                            notification.clone(),
                            app.clone(),
                        ));
                        set_appdata(
                            app.clone(),
                            NOTIFIED_AT.into(),
                            to_value(&notification.indexed_at)?,
                        )?;
                    }
                }
            }
            app.emit(
                EmitEvent::UnreadCount.as_ref(),
                NotificationEvent::Unread { count },
            )?;
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

async fn notify<R: Runtime>(
    agent: Arc<AtpAgent<TauriPluginStore<R>, ReqwestClient>>,
    notification: atrium_api::app::bsky::notification::list_notifications::Notification,
    app: tauri::AppHandle<R>,
) -> Result<()> {
    if !with_store(app.clone(), app.state(), STORE_SETTING_PATH, |store| {
        Ok(store.get(SETTING_NOTIFICATION).cloned())
    })?
    .and_then(|v| from_value::<bool>(v.clone()).ok())
    .unwrap_or(true)
    {
        log::info!("skip notifying");
        return Ok(());
    }
    let author = notification.author.clone();
    let author_name = author
        .display_name
        .filter(|s| !s.is_empty())
        .unwrap_or(author.handle.to_string());
    let (title, uri) = match notification.reason.as_str() {
        "like" => (
            format!("{author_name} liked your post"),
            notification.reason_subject,
        ),
        "repost" => (
            format!("{author_name} reposted your post"),
            notification.reason_subject,
        ),
        "follow" => (
            format!("{author_name} followed you"),
            notification.reason_subject,
        ),
        "mention" => (
            format!("{author_name} mentioned you"),
            Some(notification.uri),
        ),
        "reply" => (
            format!("{author_name} replied to you"),
            Some(notification.uri),
        ),
        "quote" => (
            format!("{author_name} quoted your post"),
            Some(notification.uri),
        ),
        _ => unreachable!(),
    };
    let mut builder = app.notification().builder().title(title);
    if let Some(uri) = uri {
        let output = agent
            .api
            .app
            .bsky
            .feed
            .get_posts(atrium_api::app::bsky::feed::get_posts::Parameters { uris: vec![uri] })
            .await?;
        if let Record::Known(KnownRecord::AppBskyFeedPost(record)) = &output.posts[0].record {
            builder = builder.body(record.text.clone())
        }
    }
    Ok(builder.show()?)
}
