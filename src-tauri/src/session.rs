use crate::appdata::{get_appdata, set_appdata};
use atrium_api::agent::{store::SessionStore, Session};
use atrium_api::types::string::Datetime;
use itertools::Itertools;
use serde::{Deserialize, Serialize};
use serde_json::{from_value, to_value, Value};
use tauri::{AppHandle, Manager, Runtime};
use tauri_plugin_store::{with_store, Result, Store};

#[cfg(debug_assertions)]
pub const STORE_SESSION_PATH: &str = "session.dev.json";
#[cfg(not(debug_assertions))]
pub const STORE_SESSION_PATH: &str = "session.json";

pub const APPDATA_CURRENT: &str = "current";

#[derive(Debug, Serialize, Deserialize)]
pub struct SessionData {
    pub session: Session,
    pub updated_at: Datetime,
}

pub struct TauriPluginStore<R: Runtime> {
    pub app: AppHandle<R>,
}

impl<R: Runtime> TauriPluginStore<R> {
    pub fn new(app: AppHandle<R>) -> Self {
        Self { app }
    }
    fn current_did(&self) -> Result<Option<String>> {
        let value = get_appdata(self.app.clone(), APPDATA_CURRENT.into())?;
        Ok(if let Some(Value::String(did)) = value {
            Some(did)
        } else {
            None
        })
    }
    fn set_current(&self, did: String) -> Result<()> {
        set_appdata(self.app.clone(), APPDATA_CURRENT.into(), to_value(did)?)
    }
}

#[async_trait::async_trait]
impl<R: Runtime> SessionStore for TauriPluginStore<R> {
    async fn get_session(&self) -> Option<Session> {
        if let Ok(Some(key)) = &self.current_did() {
            match with_store(
                self.app.clone(),
                self.app.state(),
                STORE_SESSION_PATH,
                |store| Ok(store.get(key).cloned()),
            ) {
                Ok(value) => {
                    if let Some(value) = value {
                        match from_value::<SessionData>(value) {
                            Ok(data) => return Some(data.session),
                            Err(err) => {
                                log::warn!("failed to deserialize session data: {err}");
                            }
                        }
                    }
                }
                Err(err) => {
                    log::warn!("failed to get session data of `{key}`: {err}");
                }
            }
        } else {
            log::info!("no current session");
        }
        None
    }
    async fn set_session(&self, session: Session) {
        let did = session.did.to_string();
        let save_data = |store: &mut Store<R>| {
            store.insert(
                did.clone(),
                to_value(SessionData {
                    updated_at: Datetime::now(),
                    session,
                })?,
            )?;
            store.save()
        };
        match with_store(
            self.app.clone(),
            self.app.state(),
            STORE_SESSION_PATH,
            save_data,
        ) {
            Ok(()) => {
                self.set_current(did).ok();
            }
            Err(err) => {
                log::warn!("failed to set session data: {err}");
            }
        }
    }
    async fn clear_session(&self) {
        if let Ok(Some(key)) = self.current_did() {
            if let Err(err) = with_store(
                self.app.clone(),
                self.app.state(),
                STORE_SESSION_PATH,
                |store| {
                    store.delete(key)?;
                    store.save()
                },
            ) {
                log::warn!("failed to delete session data: {err}");
            }
        } else {
            log::info!("no current session");
        }
    }
}

pub fn values<R: Runtime>(app: AppHandle<R>) -> Result<Vec<SessionData>> {
    Ok(
        with_store(app.clone(), app.state(), STORE_SESSION_PATH, |store| {
            Ok(store.values().cloned().collect_vec())
        })?
        .into_iter()
        .filter_map(|value| from_value(value).ok())
        .collect(),
    )
}
