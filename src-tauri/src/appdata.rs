use serde_json::Value;
use tauri::Manager;
use tauri::{AppHandle, Runtime};
use tauri_plugin_store::{with_store, Result};

#[cfg(debug_assertions)]
pub const STORE_APPDATA_PATH: &str = "appdata.dev.json";
#[cfg(not(debug_assertions))]
pub const STORE_APPDATA_PATH: &str = "appdata.json";

#[tauri::command]
pub fn get_appdata<R: Runtime>(app: AppHandle<R>, key: String) -> Result<Option<Value>> {
    with_store(app.clone(), app.state(), STORE_APPDATA_PATH, |store| {
        Ok(store.get(key).cloned())
    })
}

#[tauri::command]
pub fn set_appdata<R: Runtime>(app: AppHandle<R>, key: String, value: Value) -> Result<()> {
    with_store(app.clone(), app.state(), STORE_APPDATA_PATH, |store| {
        store.insert(key, value.clone())?;
        store.save()
    })
}

pub fn delete_appdata<R: Runtime>(app: AppHandle<R>, key: String) -> Result<()> {
    with_store(app.clone(), app.state(), STORE_APPDATA_PATH, |store| {
        store.delete(key)?;
        store.save()
    })
}
