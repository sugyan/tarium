mod commands;
mod error;
mod session_store;
mod state;

use crate::session_store::FileStore;
use crate::state::State;
use atrium_api::agent::AtpAgent;
use atrium_xrpc_client::reqwest::ReqwestClient;
use std::fs::create_dir_all;
use tauri::async_runtime::Mutex;
use tauri::{Manager, Wry};

fn setup(app: &mut tauri::App<Wry>) -> Result<(), Box<dyn std::error::Error>> {
    let data_dir = app.path().app_data_dir()?;
    create_dir_all(&data_dir)?;
    // TODO: how switch to different account?
    let session_path = data_dir.join("session.json");
    let agent = Mutex::new(if session_path.exists() {
        let session_store = FileStore::new(session_path);
        Some(AtpAgent::new(
            ReqwestClient::new("https://bsky.social"),
            session_store,
        ))
    } else {
        None
    });
    app.manage(State { agent });
    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(setup)
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![
            commands::login,
            commands::logout,
            commands::get_session,
            commands::get_timeline
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
