use crate::session_store::FileStore;
use atrium_api::agent::AtpAgent;
use atrium_xrpc_client::reqwest::ReqwestClient;

pub struct State {
    pub agent: AtpAgent<FileStore, ReqwestClient>,
}
