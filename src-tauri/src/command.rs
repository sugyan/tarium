use crate::error::{Error, Result};
use crate::session_store::{TauriPluginStore, CURRENT};
use crate::state::State;
use crate::task::{poll_feed, poll_notifications, poll_unread_notifications};
use crate::STORE_APPDATA_PATH;
use atrium_api::agent::AtpAgent;
use atrium_api::records::Record;
use atrium_api::types::{Collection, Union};
use atrium_xrpc_client::reqwest::ReqwestClient;
use serde::Deserialize;
use serde_json::from_value;
use std::sync::Arc;
use tauri::{AppHandle, Manager, Runtime};
use tauri_plugin_store::with_store;

#[tauri::command]
pub async fn login<R: Runtime>(
    identifier: &str,
    password: &str,
    app: tauri::AppHandle<R>,
    state: tauri::State<'_, State<R>>,
) -> Result<atrium_api::com::atproto::server::create_session::Output> {
    let agent = AtpAgent::new(
        ReqwestClient::new("https://bsky.social"),
        TauriPluginStore::new(app.clone()),
    );
    let result = agent.login(identifier, password).await?;
    state.agent.lock().await.replace(Arc::new(agent));
    Ok(result)
}

#[tauri::command]
pub async fn logout<R: Runtime>(
    app: AppHandle<R>,
    state: tauri::State<'_, State<R>>,
) -> Result<()> {
    with_store(app.clone(), app.state(), STORE_APPDATA_PATH, |store| {
        store.delete(CURRENT)?;
        store.save()
    })?;
    *state.agent.lock().await = None;
    Ok(())
}

#[tauri::command]
pub async fn get_session<R: Runtime>(
    _: AppHandle<R>,
    state: tauri::State<'_, State<R>>,
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
pub async fn get_preferences<R: Runtime>(
    _: AppHandle<R>,
    state: tauri::State<'_, State<R>>,
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
pub async fn get_feed_generators<R: Runtime>(
    app: AppHandle<R>,
    state: tauri::State<'_, State<R>>,
) -> Result<atrium_api::app::bsky::feed::get_feed_generators::Output> {
    let agent = state
        .agent
        .lock()
        .await
        .as_ref()
        .ok_or(Error::NoAgent)?
        .clone();
    let preferences = get_preferences(app, state).await?;
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
pub async fn get_posts<R: Runtime>(
    uris: Vec<String>,
    _: AppHandle<R>,
    state: tauri::State<'_, State<R>>,
) -> Result<atrium_api::app::bsky::feed::get_posts::Output> {
    log::info!("get_posts: {uris:?}");
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
pub async fn subscribe<R: Runtime>(
    subscription: Subscription,
    app: tauri::AppHandle<R>,
    _: AppHandle<R>,
    state: tauri::State<'_, State<R>>,
) -> Result<()> {
    if state.subscription_sender.lock().await.is_none() {
        log::info!("start subscription: {subscription:?}");
        let agent = state
            .agent
            .lock()
            .await
            .as_ref()
            .ok_or(Error::NoAgent)?
            .clone();
        let (sender, receiver) = tokio::sync::oneshot::channel();
        state.subscription_sender.lock().await.replace(sender);
        match subscription {
            Subscription::Feed { uri } => {
                tauri::async_runtime::spawn(poll_feed(uri, agent, receiver, app));
            }
            Subscription::Notification => {
                tauri::async_runtime::spawn(poll_notifications(agent, receiver, app));
            }
        }
    } else {
        log::info!("already subscribing");
    }
    Ok(())
}

#[tauri::command]
pub async fn subscribe_notification<R: Runtime>(
    app: tauri::AppHandle<R>,
    state: tauri::State<'_, State<R>>,
) -> Result<()> {
    if state.notification_sender.lock().await.is_none() {
        log::info!("start subscribe notification");
        let agent = state
            .agent
            .lock()
            .await
            .as_ref()
            .ok_or(Error::NoAgent)?
            .clone();
        let (sender, receiver) = tokio::sync::oneshot::channel();
        state.notification_sender.lock().await.replace(sender);
        tauri::async_runtime::spawn(poll_unread_notifications(agent, receiver, app));
    } else {
        log::info!("already subscribing");
    }
    Ok(())
}

#[tauri::command]
pub async fn unsubscribe<R: Runtime>(
    _: AppHandle<R>,
    state: tauri::State<'_, State<R>>,
) -> Result<()> {
    if let Some(sender) = state.subscription_sender.lock().await.take() {
        log::info!("cancel subscription");
        sender.send(()).expect("failed to send");
    }
    Ok(())
}

#[tauri::command]
pub async fn unsubscribe_notification<R: Runtime>(
    _: AppHandle<R>,
    state: tauri::State<'_, State<R>>,
) -> Result<()> {
    if let Some(sender) = state.notification_sender.lock().await.take() {
        log::info!("cancel subscribe notification");
        sender.send(()).expect("failed to send");
    }
    Ok(())
}

#[tauri::command]
pub async fn create_post<R: Runtime>(
    text: String,
    app: tauri::AppHandle<R>,
    state: tauri::State<'_, State<R>>,
) -> Result<atrium_api::com::atproto::repo::create_record::Output> {
    let did = from_value::<String>(
        with_store(app.clone(), app.state(), STORE_APPDATA_PATH, |store| {
            Ok(store.get(CURRENT).cloned())
        })?
        .ok_or(Error::NoSession)?,
    )?
    .parse()
    .expect("failed to parse DID");
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
            repo: did,
            rkey: None,
            swap_commit: None,
            validate: None,
        })
        .await?)
}
