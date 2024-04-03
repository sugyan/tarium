use crate::error::{Error, Result};
use crate::session_store::{FileSessionStore, FileStore};
use crate::state::State;
use crate::task::{poll_feed, poll_notifications};
use atrium_api::agent::store::SessionStore;
use atrium_api::agent::AtpAgent;
use atrium_api::records::Record;
use atrium_api::types::{Collection, Union};
use atrium_xrpc_client::reqwest::ReqwestClient;
use serde::Deserialize;
use std::sync::Arc;
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

#[tauri::command]
pub async fn get_posts(
    uris: Vec<String>,
    state: tauri::State<'_, State>,
) -> Result<atrium_api::app::bsky::feed::get_posts::Output> {
    println!("get_posts: {uris:?}");
    Ok(state
        .agent
        .lock()
        .await
        .as_ref()
        .ok_or(Error::NoAgent)?
        .api
        .app
        .bsky
        .feed
        .get_posts(atrium_api::app::bsky::feed::get_posts::Parameters { uris })
        .await?)
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum Subscription {
    Feed { uri: Option<String> },
    Notification,
}

#[tauri::command]
pub async fn subscribe(
    subscription: Subscription,
    app_handle: tauri::AppHandle,
    state: tauri::State<'_, State>,
) -> Result<()> {
    if state.sender.lock().await.is_none() {
        println!("start subscription");
        let (sender, receiver) = tokio::sync::oneshot::channel();
        state.sender.lock().await.replace(sender);
        let agent = state
            .agent
            .lock()
            .await
            .as_ref()
            .ok_or(Error::NoAgent)?
            .clone();
        match subscription {
            Subscription::Feed { uri } => {
                tauri::async_runtime::spawn(poll_feed(uri, agent, receiver, app_handle));
            }
            Subscription::Notification => {
                tauri::async_runtime::spawn(watch_notifications(agent, receiver, app_handle));
            }
        }
    } else {
        println!("already subscribing")
    }
    Ok(())
}

#[tauri::command]
pub async fn unsubscribe(state: tauri::State<'_, State>) -> Result<()> {
    if let Some(sender) = state.sender.lock().await.take() {
        println!("cancel subscription");
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
