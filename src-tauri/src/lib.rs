use atrium_api::agent::{store::MemorySessionStore, AtpAgent};
use atrium_xrpc_client::reqwest::ReqwestClient;
use serde::Serialize;
use thiserror::Error;

#[derive(Debug, Error)]
enum Error {
    #[error(transparent)]
    CreateSession(
        #[from]
        atrium_api::xrpc::error::Error<atrium_api::com::atproto::server::create_session::Error>,
    ),
}

impl Serialize for Error {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        serializer.serialize_str(self.to_string().as_str())
    }
}

#[tauri::command]
async fn sign_in(
    identifier: &str,
    password: &str,
) -> Result<atrium_api::com::atproto::server::create_session::Output, Error> {
    let agent = AtpAgent::new(
        ReqwestClient::new("https://bsky.social"),
        MemorySessionStore::default(),
    );
    Ok(agent.login(identifier, password).await?)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![sign_in])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
