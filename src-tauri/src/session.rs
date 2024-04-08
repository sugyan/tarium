use crate::STORE_APPDATA_PATH;
use atrium_api::agent::{store::SessionStore, Session};
use serde_json::{from_value, to_value, Value};
use tauri::{AppHandle, Manager, Runtime};
use tauri_plugin_store::with_store;

#[cfg(debug_assertions)]
pub const STORE_SESSION_PATH: &str = "session.dev.json";
#[cfg(not(debug_assertions))]
pub const STORE_SESSION_PATH: &str = "session.json";

pub const APPDATA_CURRENT: &str = "current";

pub struct TauriPluginStore<R: Runtime> {
    pub app: AppHandle<R>,
}

impl<R: Runtime> TauriPluginStore<R> {
    pub fn new(app: AppHandle<R>) -> Self {
        Self { app }
    }
    fn current_did(&self) -> Option<String> {
        let value = with_store(
            self.app.clone(),
            self.app.state(),
            STORE_APPDATA_PATH,
            |store| Ok(store.get(APPDATA_CURRENT).cloned()),
        )
        .expect("failed to get current session");
        if let Some(Value::String(did)) = value {
            Some(did)
        } else {
            None
        }
    }
    fn set_current(&self, did: String) {
        with_store(
            self.app.clone(),
            self.app.state(),
            STORE_APPDATA_PATH,
            |store| {
                store.insert(APPDATA_CURRENT.into(), to_value(did)?)?;
                store.save()
            },
        )
        .expect("failed to set current session");
    }
}

#[async_trait::async_trait]
impl<R: Runtime> SessionStore for TauriPluginStore<R> {
    async fn get_session(&self) -> Option<Session> {
        if let Some(key) = self.current_did() {
            let value = with_store(
                self.app.clone(),
                self.app.state(),
                STORE_SESSION_PATH,
                |store| Ok(store.get(key).cloned()),
            )
            .expect("failed to get session data");
            value.map(|v| from_value(v).expect("failed to deserialize"))
        } else {
            None
        }
    }
    async fn set_session(&self, session: Session) {
        let did = session.did.to_string();
        with_store(
            self.app.clone(),
            self.app.state(),
            STORE_SESSION_PATH,
            |store| {
                store.insert(did.clone(), to_value(session)?)?;
                store.save()
            },
        )
        .expect("failed to set session data");
        self.set_current(did);
    }
    async fn clear_session(&self) {
        if let Some(key) = self.current_did() {
            with_store(
                self.app.clone(),
                self.app.state(),
                STORE_SESSION_PATH,
                |store| {
                    store.delete(key)?;
                    store.save()
                },
            )
            .expect("failed to delete session data");
        }
    }
}
