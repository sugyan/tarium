use crate::error::Error;
use crate::session_store::FileStore;
use crate::state::State;
use atrium_api::agent::AtpAgent;
use atrium_xrpc_client::reqwest::ReqwestClient;
use std::collections::HashSet;
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

#[tauri::command]
pub async fn get_timeline(
    state: tauri::State<'_, State>,
) -> Result<atrium_api::app::bsky::feed::get_timeline::Output, Error> {
    Ok(state
        .inner()
        .agent
        .lock()
        .await
        .as_ref()
        .ok_or(Error::NoAgent)?
        .api
        .app
        .bsky
        .feed
        .get_timeline(atrium_api::app::bsky::feed::get_timeline::Parameters {
            algorithm: None,
            cursor: None,
            limit: 30.try_into().ok(),
        })
        .await?)
}

async fn background_task(
    agent: Arc<AtpAgent<FileStore, ReqwestClient>>,
    mut receiver: tokio::sync::oneshot::Receiver<()>,
    app_handle: tauri::AppHandle,
) -> Result<(), Error> {
    let mut cids = HashSet::new();
    let mut interval = tokio::time::interval(Duration::from_secs(60));
    loop {
        tokio::select! {
            _ = &mut receiver => {
                println!("cancelling");
                break;
            }
            _ = interval.tick() => {
                println!("checking for new posts");
                if  agent.api.app.bsky.feed.get_timeline(atrium_api::app::bsky::feed::get_timeline::Parameters {
                    algorithm: None,
                    cursor: None,
                    limit: 1.try_into().ok(),
                }).await?.feed.first().map(|post| !cids.contains(post.post.cid.as_ref())).unwrap_or_default() {
                    println!("found new post");
                    let output = agent.api.app.bsky.feed.get_timeline(atrium_api::app::bsky::feed::get_timeline::Parameters {
                        algorithm: None,
                        cursor: None,
                        limit: 30.try_into().ok(),
                    }).await?;
                    for post in output.feed.iter().rev() {
                        let cid = *post.post.cid.as_ref();
                        if cids.contains(&cid) {
                            continue;
                        }
                        cids.insert(cid);
                        println!("emit {cid}");
                        tokio::time::sleep(Duration::from_millis(200)).await;
                        app_handle.emit("post", post).ok();
                    }
                }
            }
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
