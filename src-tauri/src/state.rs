use crate::session_store::FileStore;
use atrium_api::agent::AtpAgent;
use atrium_xrpc_client::reqwest::ReqwestClient;
use std::sync::Arc;
use tauri::async_runtime::Mutex;

#[derive(Default)]
pub struct State {
    pub agent: Mutex<Option<Arc<AtpAgent<FileStore, ReqwestClient>>>>,
    pub sender: Mutex<Option<tokio::sync::oneshot::Sender<()>>>,
}
