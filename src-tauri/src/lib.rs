mod appdata;
mod command;
mod consts;
mod error;
mod event;
mod session;
mod setting;
mod state;
mod task;

use crate::appdata::STORE_APPDATA_PATH;
use crate::session::{TauriPluginStore, STORE_SESSION_PATH};
use crate::setting::STORE_SETTING_PATH;
use crate::state::State;
use atrium_api::agent::AtpAgent;
use atrium_xrpc_client::reqwest::ReqwestClient;
use log::LevelFilter;
use std::sync::Arc;
use tauri::async_runtime::Mutex;
use tauri::menu::{Menu, MenuItemBuilder, MenuItemKind};
use tauri::{Manager, Wry};
use tauri_plugin_store::StoreBuilder;

fn setup(app: &mut tauri::App<Wry>) -> Result<(), Box<dyn std::error::Error>> {
    // TODO: how switch to different account?
    app.manage(State {
        agent: Mutex::new(Arc::new(AtpAgent::new(
            ReqwestClient::new("https://bsky.social"),
            TauriPluginStore::new(app.handle().clone()),
        ))),
        subscription_sender: Mutex::new(None),
        notification_sender: Mutex::new(None),
    });
    app.handle()
        .plugin(
            tauri_plugin_store::Builder::new()
                .stores([
                    StoreBuilder::new(STORE_APPDATA_PATH).build(app.handle().clone()),
                    StoreBuilder::new(STORE_SESSION_PATH).build(app.handle().clone()),
                    StoreBuilder::new(STORE_SETTING_PATH).build(app.handle().clone()),
                ])
                .freeze()
                .build(),
        )
        .expect("failed to add plugin");
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
        .plugin(
            tauri_plugin_log::Builder::new()
                .level(LevelFilter::Info)
                .with_colors(Default::default())
                .build(),
        )
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .invoke_handler(tauri::generate_handler![
            appdata::get_appdata,
            appdata::set_appdata,
            setting::get_setting,
            setting::set_setting,
            command::login,
            command::logout,
            command::me,
            command::get_profile,
            command::get_feed_generators,
            command::get_posts,
            command::subscribe,
            command::subscribe_notification,
            command::unsubscribe,
            command::unsubscribe_notification,
            command::update_seen,
            command::create_post,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
