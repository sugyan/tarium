use async_trait::async_trait;
use atrium_api::agent::{store::SessionStore, Session};
use std::fs::File;
use std::path::{Path, PathBuf};

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
        // TODO: async file read
        File::open(&self.path)
            .map(|file| serde_json::from_reader(file).ok())
            .ok()
            .flatten()
    }
    async fn set_session(&self, session: Session) {
        // TODO: async file write
        File::create(&self.path)
            .map(|file| serde_json::to_writer(file, &session).ok())
            .ok();
    }
    async fn clear_session(&self) {
        // TODO: async file delete
        std::fs::remove_file(&self.path).ok();
    }
}
