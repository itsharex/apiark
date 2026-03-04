use tauri::{AppHandle, State};

use crate::commands::history::AppState;
use crate::oauth::OAuthTokenStore;
use crate::runner::collection_runner;
use crate::runner::{RunConfig, RunSummary};

#[tauri::command]
pub async fn run_collection_command(
    app: AppHandle,
    state: State<'_, AppState>,
    oauth_store: State<'_, OAuthTokenStore>,
    config: RunConfig,
) -> Result<RunSummary, String> {
    let history_db = state.history_db.clone();
    collection_runner::run_collection(app, config, history_db, &oauth_store).await
}
