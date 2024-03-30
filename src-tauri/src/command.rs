use crate::consts::EmitEvent;
use crate::error::{Error, Result};
use crate::event::PostEvent;
use crate::session_store::{FileSessionStore, FileStore};
use crate::state::State;
use atrium_api::agent::store::SessionStore;
use atrium_api::agent::AtpAgent;
use atrium_api::records::Record;
use atrium_api::types::{Collection, Union};
use atrium_xrpc_client::reqwest::ReqwestClient;
use std::collections::HashMap;
use std::sync::Arc;
use std::time::Duration;
use tauri::Manager;

#[tauri::command]
pub async fn login(
    identifier: &str,
    password: &str,
    app_handle: tauri::AppHandle,
    state: tauri::State<'_, State>,
) -> Result<atrium_api::com::atproto::server::create_session::Output> {
    let session_path = app_handle
        .path()
        .app_data_dir()
        .expect("failed to get app data dir")
        .join("session.json");
    let store = Arc::new(FileStore::new(session_path));
    let agent = AtpAgent::new(
        ReqwestClient::new("https://bsky.social"),
        FileSessionStore {
            store: store.clone(),
        },
    );
    let result = agent.login(identifier, password).await?;
    state.agent.lock().await.replace(Arc::new(agent));
    state.store.lock().await.replace(store);
    Ok(result)
}

#[tauri::command]
pub async fn logout(state: tauri::State<'_, State>) -> Result<()> {
    *state.agent.lock().await = None;
    *state.store.lock().await = None;
    Ok(())
}

#[tauri::command]
pub async fn get_session(
    state: tauri::State<'_, State>,
) -> Result<atrium_api::com::atproto::server::get_session::Output> {
    Ok(state
        .agent
        .lock()
        .await
        .as_ref()
        .ok_or(Error::NoAgent)?
        .api
        .com
        .atproto
        .server
        .get_session()
        .await?)
}

#[tauri::command]
pub async fn get_preferences(
    state: tauri::State<'_, State>,
) -> Result<atrium_api::app::bsky::actor::get_preferences::Output> {
    Ok(state
        .agent
        .lock()
        .await
        .as_ref()
        .ok_or(Error::NoAgent)?
        .api
        .app
        .bsky
        .actor
        .get_preferences(atrium_api::app::bsky::actor::get_preferences::Parameters {})
        .await?)
}

#[tauri::command]
pub async fn get_feed_generators(
    state: tauri::State<'_, State>,
) -> Result<atrium_api::app::bsky::feed::get_feed_generators::Output> {
    let agent = state
        .agent
        .lock()
        .await
        .as_ref()
        .ok_or(Error::NoAgent)?
        .clone();
    let preferences = get_preferences(state).await?;
    let feeds = preferences
        .preferences
        .iter()
        .find_map(|pref| {
            if let Union::Refs(
                atrium_api::app::bsky::actor::defs::PreferencesItem::SavedFeedsPref(p),
            ) = pref
            {
                Some(p.pinned.clone())
            } else {
                None
            }
        })
        .unwrap_or_default();
    Ok(agent
        .api
        .app
        .bsky
        .feed
        .get_feed_generators(atrium_api::app::bsky::feed::get_feed_generators::Parameters { feeds })
        .await?)
}

async fn background_task(
    uri: Option<String>,
    agent: Arc<AtpAgent<FileSessionStore, ReqwestClient>>,
    mut receiver: tokio::sync::oneshot::Receiver<()>,
    app_handle: tauri::AppHandle,
) -> Result<()> {
    use atrium_api::app::bsky::feed::defs::{FeedViewPost, ReplyRefParentRefs};
    async fn check_new_post(
        uri: &Option<String>,
        app_handle: &tauri::AppHandle,
        agent: &Arc<AtpAgent<FileSessionStore, ReqwestClient>>,
        cids: &mut HashMap<String, FeedViewPost>,
    ) -> Result<()> {
        println!("checking posts");
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
                println!("cancelling");
                break;
            }
            _ = interval.tick() => check_new_post(&uri, &app_handle, &agent, &mut cids).await?,
        }
    }
    Ok(())
}

#[tauri::command]
pub async fn subscribe(
    uri: Option<String>,
    app_handle: tauri::AppHandle,
    state: tauri::State<'_, State>,
) -> Result<()> {
    if state.sender.lock().await.is_none() {
        let (sender, receiver) = tokio::sync::oneshot::channel();
        state.sender.lock().await.replace(sender);
        let agent = state
            .agent
            .lock()
            .await
            .as_ref()
            .ok_or(Error::NoAgent)?
            .clone();
        tauri::async_runtime::spawn(background_task(uri, agent, receiver, app_handle));
    }
    Ok(())
}

#[tauri::command]
pub async fn unsubscribe(state: tauri::State<'_, State>) -> Result<()> {
    if let Some(sender) = state.sender.lock().await.take() {
        sender.send(()).expect("failed to send");
    }
    Ok(())
}

#[tauri::command]
pub async fn create_post(
    text: String,
    state: tauri::State<'_, State>,
) -> Result<atrium_api::com::atproto::repo::create_record::Output> {
    let session = state
        .store
        .lock()
        .await
        .as_ref()
        .ok_or(Error::NoStore)?
        .get_session()
        .await
        .ok_or(Error::NoSession)?;
    Ok(state
        .agent
        .lock()
        .await
        .as_ref()
        .ok_or(Error::NoAgent)?
        .api
        .com
        .atproto
        .repo
        .create_record(atrium_api::com::atproto::repo::create_record::Input {
            collection: atrium_api::app::bsky::feed::Post::NSID
                .parse()
                .expect("failed to parse NSID"),
            record: Record::Known(atrium_api::records::KnownRecord::AppBskyFeedPost(Box::new(
                atrium_api::app::bsky::feed::post::Record {
                    created_at: atrium_api::types::string::Datetime::now(),
                    embed: None,
                    entities: None,
                    facets: None,
                    labels: None,
                    langs: None,
                    reply: None,
                    tags: None,
                    text,
                },
            ))),
            repo: atrium_api::types::string::AtIdentifier::Did(session.did),
            rkey: None,
            swap_commit: None,
            validate: None,
        })
        .await?)
}
