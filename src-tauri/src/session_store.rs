use async_trait::async_trait;
use atrium_api::agent::{store::SessionStore, Session};
use std::path::{Path, PathBuf};
use std::sync::Arc;
use tokio::fs;
use tokio::io::{AsyncReadExt, AsyncWriteExt};

pub struct FileSessionStore {
    pub store: Arc<FileStore>,
}

#[async_trait]
impl SessionStore for FileSessionStore {
    async fn get_session(&self) -> Option<Session> {
        self.store.get_session().await
    }
    async fn set_session(&self, session: Session) {
        self.store.set_session(session).await
    }
    async fn clear_session(&self) {
        self.store.clear_session().await
    }
}

pub struct FileStore {
    path: PathBuf,
}

impl FileStore {
    pub fn new(path: impl AsRef<Path>) -> Self {
        Self {
            path: path.as_ref().into(),
        }
    }
}

#[async_trait]
impl SessionStore for FileStore {
    async fn get_session(&self) -> Option<Session> {
        let mut file = fs::File::open(&self.path).await.ok()?;
        let mut buf = Vec::new();
        file.read_to_end(&mut buf).await.ok()?;
        serde_json::from_slice(&buf).ok()
    }
    async fn set_session(&self, session: Session) {
        if let Ok(mut file) = fs::File::create(&self.path).await {
            if let Ok(data) = serde_json::to_vec(&session) {
                file.write_all(&data).await.ok();
            }
        }
    }
    async fn clear_session(&self) {
        fs::remove_file(&self.path).await.ok();
    }
}
