use crate::appdata;
use crate::consts::EmitEvent;
use crate::error::{Error, Result};
use crate::event::NotificationEvent;
use crate::session::{TauriPluginStore, APPDATA_CURRENT};
use crate::state::State;
use crate::task::{poll_feed, poll_notifications, poll_unread_notifications};
use atrium_api::agent::store::SessionStore;
use atrium_api::agent::AtpAgent;
use atrium_api::records::Record;
use atrium_api::types::string::{Datetime, Did, Language};
use atrium_api::types::{Collection, Union};
use atrium_xrpc_client::reqwest::ReqwestClient;
use serde::Deserialize;
use serde_json::from_value;
use std::sync::Arc;
use tauri::{AppHandle, Manager, Runtime};

#[tauri::command]
pub async fn login<R: Runtime>(
    identifier: &str,
    password: &str,
    app: tauri::AppHandle<R>,
) -> Result<atrium_api::com::atproto::server::create_session::Output> {
    let agent = AtpAgent::new(
        ReqwestClient::new("https://bsky.social"),
        TauriPluginStore::new(app.clone()),
    );
    let result = agent.login(identifier, password).await?;
    *app.state::<State<R>>().agent.lock().await = Arc::new(agent);
    Ok(result)
}

#[tauri::command]
pub async fn logout<R: Runtime>(app: AppHandle<R>) -> Result<()> {
    Ok(appdata::delete_appdata(app, APPDATA_CURRENT.into())?)
}

#[tauri::command]
pub async fn me<R: Runtime>(app: AppHandle<R>) -> Result<Did> {
    log::info!("me");
    let agent = app.state::<State<R>>().agent.lock().await.clone();
    let session = TauriPluginStore { app }
        .get_session()
        .await
        .ok_or(Error::NoSession)?;
    let did = session.did.clone();
    agent.resume_session(session).await?;
    Ok(did)
}

pub async fn get_preferences<R: Runtime>(
    app: AppHandle<R>,
) -> Result<atrium_api::app::bsky::actor::get_preferences::Output> {
    Ok(app
        .state::<State<R>>()
        .agent
        .lock()
        .await
        .api
        .app
        .bsky
        .actor
        .get_preferences(atrium_api::app::bsky::actor::get_preferences::Parameters {})
        .await?)
}

#[tauri::command]
pub async fn get_profile<R: Runtime>(
    app: AppHandle<R>,
) -> Result<atrium_api::app::bsky::actor::get_profile::Output> {
    let actor = did(app.clone())?.parse().expect("failed to parse DID");
    Ok(app
        .state::<State<R>>()
        .agent
        .lock()
        .await
        .api
        .app
        .bsky
        .actor
        .get_profile(atrium_api::app::bsky::actor::get_profile::Parameters { actor })
        .await?)
}

#[tauri::command]
pub async fn get_feed_generators<R: Runtime>(
    app: AppHandle<R>,
) -> Result<atrium_api::app::bsky::feed::get_feed_generators::Output> {
    log::info!("get_feed_generators");
    let agent = app.state::<State<R>>().agent.lock().await.clone();
    let preferences = get_preferences(app).await?;
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
    app: AppHandle<R>,
) -> Result<atrium_api::app::bsky::feed::get_posts::Output> {
    log::info!("get_posts: {uris:?}");
    Ok(app
        .state::<State<R>>()
        .agent
        .lock()
        .await
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
) -> Result<()> {
    let state = app.state::<State<R>>();
    if state.subscription_sender.lock().await.is_none() {
        log::info!("start subscription: {subscription:?}");
        let agent = state.agent.lock().await.clone();
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
pub async fn subscribe_notification<R: Runtime>(app: tauri::AppHandle<R>) -> Result<()> {
    let state = app.state::<State<R>>();
    if state.notification_sender.lock().await.is_none() {
        log::info!("start subscribe notification");
        let agent = state.agent.lock().await.clone();
        let (sender, receiver) = tokio::sync::oneshot::channel();
        state.notification_sender.lock().await.replace(sender);
        tauri::async_runtime::spawn(poll_unread_notifications(agent, receiver, app));
    } else {
        log::info!("already subscribing");
    }
    Ok(())
}

#[tauri::command]
pub async fn unsubscribe<R: Runtime>(app: AppHandle<R>) -> Result<()> {
    if let Some(sender) = app
        .state::<State<R>>()
        .subscription_sender
        .lock()
        .await
        .take()
    {
        log::info!("cancel subscription");
        sender.send(()).expect("failed to send");
    }
    Ok(())
}

#[tauri::command]
pub async fn unsubscribe_notification<R: Runtime>(app: AppHandle<R>) -> Result<()> {
    if let Some(sender) = app
        .state::<State<R>>()
        .notification_sender
        .lock()
        .await
        .take()
    {
        log::info!("cancel subscribe notification");
        sender.send(()).expect("failed to send");
    }
    Ok(())
}

#[tauri::command]
pub async fn update_seen<R: Runtime>(app: tauri::AppHandle<R>) -> Result<()> {
    let seen_at = Datetime::now();
    log::info!("update_seen: {}", seen_at.as_ref());
    app.state::<State<R>>()
        .agent
        .lock()
        .await
        .api
        .app
        .bsky
        .notification
        .update_seen(atrium_api::app::bsky::notification::update_seen::Input { seen_at })
        .await?;
    Ok(app.emit(
        EmitEvent::UnreadCount.as_ref(),
        NotificationEvent::Unread { count: 0 },
    )?)
}

#[tauri::command]
pub async fn create_post<R: Runtime>(
    text: String,
    langs: Option<Vec<Language>>,
    app: tauri::AppHandle<R>,
) -> Result<atrium_api::com::atproto::repo::create_record::Output> {
    log::info!("create_post");
    let did = did(app.clone())?.parse().expect("failed to parse DID");
    Ok(app
        .state::<State<R>>()
        .agent
        .lock()
        .await
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
                    langs,
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

pub fn did<R: Runtime>(app: AppHandle<R>) -> Result<String> {
    Ok(from_value::<String>(
        appdata::get_appdata(app, APPDATA_CURRENT.into())?.ok_or(Error::NoSession)?,
    )?)
}
