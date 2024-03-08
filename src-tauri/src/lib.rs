mod commands;
mod error;
mod session_store;
mod state;

use crate::session_store::FileStore;
use crate::state::State;
use std::fs::create_dir_all;
use tauri::{Manager, Wry};

fn setup(app: &mut tauri::App<Wry>) -> Result<(), Box<dyn std::error::Error>> {
    let data_dir = app.path().app_data_dir()?;
    create_dir_all(&data_dir)?;
    // TODO: how switch to different account?
    let session_store = FileStore::new(data_dir.join("session.json"));
    app.manage(State {
        agent: atrium_api::agent::AtpAgent::new(
            atrium_xrpc_client::reqwest::ReqwestClient::new("https://bsky.social"),
            session_store,
        ),
    });
    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(setup)
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            commands::login,
            commands::get_session,
            commands::get_timeline
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
