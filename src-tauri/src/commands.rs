use crate::error::Error;
use crate::state::State;

#[tauri::command]
pub async fn login(
    identifier: &str,
    password: &str,
    state: tauri::State<'_, State>,
) -> Result<atrium_api::com::atproto::server::create_session::Output, Error> {
    Ok(state.inner().agent.login(identifier, password).await?)
}

#[tauri::command]
pub async fn get_session(
    state: tauri::State<'_, State>,
) -> Result<atrium_api::com::atproto::server::get_session::Output, Error> {
    Ok(state
        .inner()
        .agent
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
