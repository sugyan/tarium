use crate::consts::EmitEvent;
use crate::error::Error;
use crate::events::PostEvent;
use crate::session_store::FileStore;
use crate::state::State;
use atrium_api::agent::AtpAgent;
use atrium_api::app::bsky::feed::defs::{FeedViewPost, ReplyRefParentEnum};
use atrium_api::types::Collection;
use atrium_xrpc_client::reqwest::ReqwestClient;
use std::collections::HashMap;
use std::ops::DerefMut;
use std::sync::Arc;
use std::time::Duration;
use tauri::Manager;

#[tauri::command]
pub async fn login(
    identifier: &str,
    password: &str,
    app_handle: tauri::AppHandle,
    state: tauri::State<'_, State>,
) -> Result<atrium_api::com::atproto::server::create_session::Output, Error> {
    let session_path = app_handle
        .path()
        .app_data_dir()
        .expect("failed to get app data dir")
        .join("session.json");
    let agent = AtpAgent::new(
        ReqwestClient::new("https://bsky.social"),
        FileStore::new(session_path),
    );
    let result = agent.login(identifier, password).await?;
    *state.inner().agent.lock().await.deref_mut() = Some(Arc::new(agent));
    Ok(result)
}

#[tauri::command]
pub async fn logout(state: tauri::State<'_, State>) -> Result<(), Error> {
    *state.inner().agent.lock().await = None;
    Ok(())
}

#[tauri::command]
pub async fn get_session(
    state: tauri::State<'_, State>,
) -> Result<atrium_api::com::atproto::server::get_session::Output, Error> {
    Ok(state
        .inner()
        .agent
        .lock()
        .await
        .as_ref()
        .ok_or(Error::NoAgent)?
        .api
        .com
        .atproto
        .server
        .get_session()
        .await?)
}

async fn background_task(
    agent: Arc<AtpAgent<FileStore, ReqwestClient>>,
    mut receiver: tokio::sync::oneshot::Receiver<()>,
    app_handle: tauri::AppHandle,
) -> Result<(), Error> {
    async fn check_new_post(
        app_handle: &tauri::AppHandle,
        agent: &Arc<AtpAgent<FileStore, ReqwestClient>>,
        cids: &mut HashMap<String, FeedViewPost>,
    ) -> Result<(), Error> {
        println!("checking posts");
        let output = agent
            .api
            .app
            .bsky
            .feed
            .get_timeline(atrium_api::app::bsky::feed::get_timeline::Parameters {
                algorithm: None,
                cursor: None,
                limit: 30.try_into().ok(),
            })
            .await?;
        for post in output.feed.iter().rev() {
            let cid = post.post.cid.as_ref().to_string();
            if let Some(prev) = cids.get(&cid) {
                if post.reason != prev.reason
                    || post.post.reply_count != prev.post.reply_count
                    || post.post.repost_count != prev.post.repost_count
                    || post.post.like_count != prev.post.like_count
                {
                    app_handle
                        .emit(EmitEvent::Post.as_ref(), PostEvent::Update(post.clone()))
                        .expect("failed to emit post event");
                }
            } else {
                if let Some(reply) = &post.reply {
                    if let ReplyRefParentEnum::PostView(post_view) = &reply.parent {
                        if let Some(prev) = cids.get(&post_view.cid.as_ref().to_string()) {
                            app_handle
                                .emit(
                                    EmitEvent::Post.as_ref(),
                                    PostEvent::Delete(prev.post.clone()),
                                )
                                .expect("failed to emit post event");
                        }
                    }
                }
                app_handle
                    .emit(EmitEvent::Post.as_ref(), PostEvent::Add(post.clone()))
                    .expect("failed to emit post event");
            }
            cids.insert(cid, post.clone());
        }
        Ok(())
    }
    let mut cids = HashMap::new();
    let mut interval = tokio::time::interval(Duration::from_secs(60));
    loop {
        tokio::select! {
            _ = &mut receiver => {
                println!("cancelling");
                break;
            }
            _ = interval.tick() => check_new_post(&app_handle, &agent, &mut cids).await?,
        }
    }
    Ok(())
}

#[tauri::command]
pub async fn subscribe(
    app_handle: tauri::AppHandle,
    state: tauri::State<'_, State>,
) -> Result<(), Error> {
    if state.inner().sender.lock().await.is_none() {
        let (sender, receiver) = tokio::sync::oneshot::channel();
        state.inner().sender.lock().await.replace(sender);
        let agent = state
            .inner()
            .agent
            .lock()
            .await
            .as_ref()
            .ok_or(Error::NoAgent)?
            .clone();
        tauri::async_runtime::spawn(background_task(agent, receiver, app_handle));
    }
    Ok(())
}

#[tauri::command]
pub async fn unsubscribe(state: tauri::State<'_, State>) -> Result<(), Error> {
    if let Some(sender) = state.inner().sender.lock().await.take() {
        sender.send(()).expect("failed to send");
    }
    Ok(())
}

#[tauri::command]
pub async fn create_post(
    text: String,
    state: tauri::State<'_, State>,
) -> Result<atrium_api::com::atproto::repo::create_record::Output, Error> {
    // TODO: store session
    let agent = state
        .inner()
        .agent
        .lock()
        .await
        .as_ref()
        .ok_or(Error::NoAgent)?
        .clone();
    let session = agent.api.com.atproto.server.get_session().await?;
    Ok(state
        .inner()
        .agent
        .lock()
        .await
        .as_ref()
        .ok_or(Error::NoAgent)?
        .api
        .com
        .atproto
        .repo
        .create_record(atrium_api::com::atproto::repo::create_record::Input {
            collection: atrium_api::app::bsky::feed::Post::NSID
                .parse()
                .expect("failed to parse NSID"),
            record: atrium_api::records::Record::AppBskyFeedPost(Box::new(
                atrium_api::app::bsky::feed::post::Record {
                    created_at: atrium_api::types::string::Datetime::now(),
                    embed: None,
                    entities: None,
                    facets: None,
                    labels: None,
                    langs: None,
                    reply: None,
                    tags: None,
                    text,
                },
            )),
            repo: atrium_api::types::string::AtIdentifier::Did(session.did),
            rkey: None,
            swap_commit: None,
            validate: None,
        })
        .await?)
}
