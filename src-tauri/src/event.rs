use atrium_api::app::bsky::feed::defs::{FeedViewPost, PostView};
use serde::Serialize;

#[derive(Serialize, Clone)]
#[serde(tag = "$type", rename_all = "lowercase")]
pub enum PostEvent {
    Add(FeedViewPost),
    Update(FeedViewPost),
    Delete(PostView),
}
