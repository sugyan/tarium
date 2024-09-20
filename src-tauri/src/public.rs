use crate::error::Result;
use atrium_api::{client::AtpServiceClient, types::string::AtIdentifier};
use atrium_xrpc_client::reqwest::ReqwestClient;

#[tauri::command]
pub async fn get_public_profile(
    actor: AtIdentifier,
) -> Result<atrium_api::app::bsky::actor::get_profile::Output> {
    log::info!("get_public_profile: {actor:?}");
    Ok(
        AtpServiceClient::new(ReqwestClient::new("https://public.api.bsky.app"))
            .service
            .app
            .bsky
            .actor
            .get_profile(atrium_api::app::bsky::actor::get_profile::ParametersData { actor }.into())
            .await?,
    )
}
