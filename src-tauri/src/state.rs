// use crate::session_store::{FileSessionStore, FileStore};
use crate::session_store::TauriPluginStore;
use atrium_api::agent::AtpAgent;
use atrium_xrpc_client::reqwest::ReqwestClient;
use std::sync::Arc;
use tauri::{async_runtime::Mutex, Runtime};

#[derive(Default)]
pub struct State<R: Runtime> {
    pub agent: Mutex<Option<Arc<AtpAgent<TauriPluginStore<R>, ReqwestClient>>>>,
    pub subscription_sender: Mutex<Option<tokio::sync::oneshot::Sender<()>>>,
    pub notification_sender: Mutex<Option<tokio::sync::oneshot::Sender<()>>>,
}
