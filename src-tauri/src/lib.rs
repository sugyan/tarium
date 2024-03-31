mod command;
mod consts;
mod error;
mod event;
mod session_store;
mod state;
mod task;

use crate::session_store::FileStore;
use crate::state::State;
use atrium_api::agent::AtpAgent;
use atrium_xrpc_client::reqwest::ReqwestClient;
use session_store::FileSessionStore;
use std::fs::create_dir_all;
use std::sync::Arc;
use tauri::async_runtime::Mutex;
use tauri::menu::{Menu, MenuItemBuilder, MenuItemKind};
use tauri::{Manager, Wry};

fn setup(app: &mut tauri::App<Wry>) -> Result<(), Box<dyn std::error::Error>> {
    let data_dir = app.path().app_data_dir()?;
    create_dir_all(&data_dir)?;
    // TODO: how switch to different account?
    let session_path = data_dir.join("session.json");
    let mut store = Mutex::new(None);
    let agent = Mutex::new(if session_path.exists() {
        let file_store = Arc::new(FileStore::new(session_path));
        store = Mutex::new(Some(file_store.clone()));
        Some(Arc::new(AtpAgent::new(
            ReqwestClient::new("https://bsky.social"),
            FileSessionStore { store: file_store },
        )))
    } else {
        None
    });
    app.manage(State {
        agent,
        store,
        ..Default::default()
    });
    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .menu(|handle| {
            let menu = Menu::default(handle)?;
            for item in menu.items()? {
                if let MenuItemKind::Submenu(submenu) = &item {
                    if submenu.text()? == "View" {
                        if let Some(MenuItemKind::Submenu(submenu)) = menu.get(item.id()) {
                            submenu.append(
                                &MenuItemBuilder::with_id(consts::MENU_ID_RELOAD, "Reload")
                                    .accelerator("cmd+r")
                                    .build(handle)?,
                            )?;
                        }
                    }
                }
            }
            handle.on_menu_event(|handle, event| {
                handle
                    .emit(event.id().as_ref(), ())
                    .expect("failed to emit event");
            });
            Ok(menu)
        })
        .setup(setup)
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .invoke_handler(tauri::generate_handler![
            command::login,
            command::logout,
            command::get_session,
            command::get_preferences,
            command::get_feed_generators,
            command::get_posts,
            command::subscribe,
            command::unsubscribe,
            command::create_post,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
