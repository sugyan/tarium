pub const MENU_ID_RELOAD: &str = "tauri-reload";

pub enum EmitEvent {
    Post,
    Notification,
    UnreadCount,
}

impl AsRef<str> for EmitEvent {
    fn as_ref(&self) -> &str {
        match self {
            Self::Post => "post",
            Self::Notification => "notification",
            Self::UnreadCount => "unread_count",
        }
    }
}
