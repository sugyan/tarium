use crate::session_store::FileStore;
use atrium_api::agent::AtpAgent;
use atrium_xrpc_client::reqwest::ReqwestClient;
use tauri::async_runtime::Mutex;

pub struct State {
    pub agent: Mutex<Option<AtpAgent<FileStore, ReqwestClient>>>,
}
