use crate::STORE_APPDATA_PATH;
use serde_json::Value;
use tauri::Manager;
use tauri::{AppHandle, Runtime};
use tauri_plugin_store::{with_store, Result};

pub fn get<R: Runtime>(app: AppHandle<R>, key: impl AsRef<str>) -> Result<Option<Value>> {
    with_store(app.clone(), app.state(), STORE_APPDATA_PATH, |store| {
        Ok(store.get(key).cloned())
    })
}

pub fn set<R: Runtime>(app: AppHandle<R>, key: impl AsRef<str>, value: &Value) -> Result<()> {
    with_store(app.clone(), app.state(), STORE_APPDATA_PATH, |store| {
        store.insert(key.as_ref().into(), value.clone())?;
        store.save()
    })
}

pub fn delete<R: Runtime>(app: AppHandle<R>, key: impl AsRef<str>) -> Result<()> {
    with_store(app.clone(), app.state(), STORE_APPDATA_PATH, |store| {
        store.delete(key.as_ref())?;
        store.save()
    })
}
