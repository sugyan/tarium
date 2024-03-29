use crate::session_store::{FileSessionStore, FileStore};
use atrium_api::agent::AtpAgent;
use atrium_xrpc_client::reqwest::ReqwestClient;
use std::sync::Arc;
use tauri::async_runtime::Mutex;

#[derive(Default)]
pub struct State {
    pub agent: Mutex<Option<Arc<AtpAgent<FileSessionStore, ReqwestClient>>>>,
    pub store: Mutex<Option<Arc<FileStore>>>,
    pub sender: Mutex<Option<tokio::sync::oneshot::Sender<()>>>,
}
