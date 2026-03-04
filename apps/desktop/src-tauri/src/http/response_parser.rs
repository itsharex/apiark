use crate::models::error::HttpEngineError;
use crate::models::request::KeyValuePair;
use crate::models::response::{CookieData, ResponseData};

/// Maximum response body size we'll load into memory: 10MB.
const MAX_BODY_SIZE: u64 = 10 * 1024 * 1024;

/// Parse a reqwest::Response into our ResponseData struct.
pub async fn parse_response(
    response: reqwest::Response,
    elapsed_ms: u64,
) -> Result<ResponseData, HttpEngineError> {
    let status = response.status().as_u16();
    let status_text = response
        .status()
        .canonical_reason()
        .unwrap_or("Unknown")
        .to_string();

    // Collect headers
    let headers: Vec<KeyValuePair> = response
        .headers()
        .iter()
        .map(|(name, value)| KeyValuePair {
            key: name.to_string(),
            value: value.to_str().unwrap_or("<binary>").to_string(),
            enabled: true,
        })
        .collect();

    // Collect cookies
    let cookies: Vec<CookieData> = response
        .cookies()
        .map(|c| CookieData {
            name: c.name().to_string(),
            value: c.value().to_string(),
            domain: c.domain().map(|d| d.to_string()),
            path: c.path().map(|p| p.to_string()),
            expires: None, // reqwest cookie doesn't easily expose raw expires
            http_only: c.http_only(),
            secure: c.secure(),
        })
        .collect();

    // Check content-length before downloading
    if let Some(len) = response.content_length() {
        if len > MAX_BODY_SIZE {
            return Err(HttpEngineError::ResponseTooLarge(MAX_BODY_SIZE));
        }
    }

    // Read body with size limit
    let bytes = response
        .bytes()
        .await
        .map_err(|e| HttpEngineError::BodyDecodeError(e.to_string()))?;

    if bytes.len() as u64 > MAX_BODY_SIZE {
        return Err(HttpEngineError::ResponseTooLarge(MAX_BODY_SIZE));
    }

    let size_bytes = bytes.len() as u64;
    let body = String::from_utf8(bytes.to_vec()).unwrap_or_else(|_| {
        // For binary responses, show a placeholder
        format!("<binary data: {} bytes>", size_bytes)
    });

    Ok(ResponseData {
        status,
        status_text,
        headers,
        cookies,
        body,
        time_ms: elapsed_ms,
        size_bytes,
    })
}
