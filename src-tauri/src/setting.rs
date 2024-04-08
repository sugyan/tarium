use serde_json::Value;
use tauri::Manager;
use tauri::{AppHandle, Runtime};
use tauri_plugin_store::{with_store, Result};

#[cfg(debug_assertions)]
pub const STORE_SETTING_PATH: &str = "setting.dev.json";
#[cfg(not(debug_assertions))]
pub const STORE_SETTING_PATH: &str = "setting.json";

#[tauri::command]
pub fn get_setting<R: Runtime>(app: AppHandle<R>, key: String) -> Result<Option<Value>> {
    with_store(app.clone(), app.state(), STORE_SETTING_PATH, |store| {
        Ok(store.get(key).cloned())
    })
}

#[tauri::command]
pub fn set_setting<R: Runtime>(app: AppHandle<R>, key: String, value: Value) -> Result<()> {
    with_store(app.clone(), app.state(), STORE_SETTING_PATH, |store| {
        store.insert(key, value.clone())?;
        store.save()
    })
}
