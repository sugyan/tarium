use atrium_api::xrpc::error::Error as XrpcError;
use serde::Serialize;
use thiserror::Error;

#[derive(Debug, Error)]
pub enum Error {
    #[error(transparent)]
    CreateSession(#[from] XrpcError<atrium_api::com::atproto::server::create_session::Error>),
    #[error(transparent)]
    GetSession(#[from] XrpcError<atrium_api::com::atproto::server::get_session::Error>),
    #[error(transparent)]
    GetTimeline(#[from] XrpcError<atrium_api::app::bsky::feed::get_timeline::Error>),
}

impl Serialize for Error {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        serializer.serialize_str(self.to_string().as_str())
    }
}
