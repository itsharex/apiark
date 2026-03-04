use crate::http::client::HttpEngine;
use crate::models::error::HttpError;
use crate::models::request::SendRequestParams;
use crate::models::response::ResponseData;

#[tauri::command]
pub async fn send_request(params: SendRequestParams) -> Result<ResponseData, String> {
    tracing::info!(method = ?params.method, url = %params.url, "Sending request");

    HttpEngine::send(params).await.map_err(|e| {
        let http_error: HttpError = e.into();
        serde_json::to_string(&http_error).unwrap_or(http_error.message)
    })
}
