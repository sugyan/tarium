use atrium_api::xrpc::error::Error as XrpcError;
use serde::Serialize;
use thiserror::Error;

pub type Result<T> = std::result::Result<T, Error>;

#[derive(Debug, Error)]
pub enum Error {
    #[error("no agent")]
    NoAgent,
    #[error("no store")]
    NoStore,
    #[error("no session")]
    NoSession,
    #[error(transparent)]
    CreateRecord(#[from] XrpcError<atrium_api::com::atproto::repo::create_record::Error>),
    #[error(transparent)]
    CreateSession(#[from] XrpcError<atrium_api::com::atproto::server::create_session::Error>),
    #[error(transparent)]
    DeleteSession(#[from] XrpcError<atrium_api::com::atproto::server::delete_session::Error>),
    #[error(transparent)]
    GetSession(#[from] XrpcError<atrium_api::com::atproto::server::get_session::Error>),
    #[error(transparent)]
    GetPreferences(#[from] XrpcError<atrium_api::app::bsky::actor::get_preferences::Error>),
    #[error(transparent)]
    GetFeed(#[from] XrpcError<atrium_api::app::bsky::feed::get_feed::Error>),
    #[error(transparent)]
    GetFeedGenerators(#[from] XrpcError<atrium_api::app::bsky::feed::get_feed_generators::Error>),
    #[error(transparent)]
    GetTimeline(#[from] XrpcError<atrium_api::app::bsky::feed::get_timeline::Error>),
}

impl Serialize for Error {
    fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        serializer.serialize_str(self.to_string().as_str())
    }
}
