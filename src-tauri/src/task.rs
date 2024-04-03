use crate::consts::EmitEvent;
use crate::error::Result;
use crate::event::PostEvent;
use crate::session_store::FileSessionStore;
use atrium_api::agent::AtpAgent;
use atrium_api::types::Union;
use atrium_xrpc_client::reqwest::ReqwestClient;
use std::collections::{HashMap, HashSet};
use std::sync::Arc;
use std::time::Duration;
use tauri::Manager;

pub async fn poll_feed(
    uri: Option<String>,
    agent: Arc<AtpAgent<FileSessionStore, ReqwestClient>>,
    mut receiver: tokio::sync::oneshot::Receiver<()>,
    app_handle: tauri::AppHandle,
) -> Result<()> {
    use atrium_api::app::bsky::feed::defs::{FeedViewPost, ReplyRefParentRefs};
    async fn fetch_posts(
        uri: &Option<String>,
        app_handle: &tauri::AppHandle,
        agent: &Arc<AtpAgent<FileSessionStore, ReqwestClient>>,
        cids: &mut HashMap<String, FeedViewPost>,
    ) -> Result<()> {
        println!("fetch posts");
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
                    app_handle
                        .emit(EmitEvent::Post.as_ref(), PostEvent::Update(post.clone()))
                        .expect("failed to emit post event");
                }
            } else {
                if let Some(reply) = &post.reply {
                    if let Union::Refs(ReplyRefParentRefs::PostView(post_view)) = &reply.parent {
                        if let Some(prev) = cids.get(&post_view.cid.as_ref().to_string()) {
                            app_handle
                                .emit(
                                    EmitEvent::Post.as_ref(),
                                    PostEvent::Delete(prev.post.clone()),
                                )
                                .expect("failed to emit post event");
                        }
                    }
                }
                app_handle
                    .emit(EmitEvent::Post.as_ref(), PostEvent::Add(post.clone()))
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
            _ = interval.tick() => fetch_posts(&uri, &app_handle, &agent, &mut cids).await?,
        }
    }
    Ok(())
}

pub async fn poll_notifications(
    agent: Arc<AtpAgent<FileSessionStore, ReqwestClient>>,
    mut receiver: tokio::sync::oneshot::Receiver<()>,
    app_handle: tauri::AppHandle,
) -> Result<()> {
    use atrium_api::app::bsky::notification::list_notifications::Parameters;
    async fn fetch_notifications(
        app_handle: &tauri::AppHandle,
        agent: &Arc<AtpAgent<FileSessionStore, ReqwestClient>>,
        cids: &mut HashSet<String>,
    ) -> Result<()> {
        println!("fetch notifications");
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
        for notification in output.notifications.iter().rev() {
            let cid = notification.cid.as_ref().to_string();
            if cids.contains(&cid) {
                continue;
            }
            cids.insert(cid);
            app_handle
                .emit(EmitEvent::Notification.as_ref(), notification)
                .expect("failed to emit post event");
        }
        Ok(())
    }
    let mut cids = HashSet::new();
    let mut interval = tokio::time::interval(Duration::from_secs(30));
    loop {
        tokio::select! {
            _ = &mut receiver => {
                break;
            }
            _ = interval.tick() => fetch_notifications(&app_handle, &agent, &mut cids).await?,
        }
    }
    Ok(())
}
