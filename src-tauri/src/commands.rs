use crate::error::Error;
use crate::session_store::FileStore;
use crate::state::State;
use atrium_api::agent::AtpAgent;
use atrium_xrpc_client::reqwest::ReqwestClient;
use std::ops::DerefMut;
use tauri::Manager;

#[tauri::command]
pub async fn login(
    identifier: &str,
    password: &str,
    app_handle: tauri::AppHandle,
    state: tauri::State<'_, State>,
) -> Result<atrium_api::com::atproto::server::create_session::Output, Error> {
    let session_path = app_handle
        .path()
        .app_data_dir()
        .expect("failed to get app data dir")
        .join("session.json");
    let agent = AtpAgent::new(
        ReqwestClient::new("https://bsky.social"),
        FileStore::new(session_path),
    );
    let result = agent.login(identifier, password).await?;
    *state.inner().agent.lock().await.deref_mut() = Some(agent);
    Ok(result)
}

#[tauri::command]
pub async fn logout(state: tauri::State<'_, State>) -> Result<(), Error> {
    *state.inner().agent.lock().await = None;
    Ok(())
}

#[tauri::command]
pub async fn get_session(
    state: tauri::State<'_, State>,
) -> Result<atrium_api::com::atproto::server::get_session::Output, Error> {
    Ok(state
        .inner()
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
pub async fn get_timeline(
    state: tauri::State<'_, State>,
) -> Result<atrium_api::app::bsky::feed::get_timeline::Output, Error> {
    Ok(state
        .inner()
        .agent
        .lock()
        .await
        .as_ref()
        .ok_or(Error::NoAgent)?
        .api
        .app
        .bsky
        .feed
        .get_timeline(atrium_api::app::bsky::feed::get_timeline::Parameters {
            algorithm: None,
            cursor: None,
            limit: None,
        })
        .await?)
}
