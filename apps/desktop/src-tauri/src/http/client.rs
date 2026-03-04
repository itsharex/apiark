use std::time::Instant;

use crate::models::error::HttpEngineError;
use crate::models::request::SendRequestParams;
use crate::models::response::ResponseData;

use super::error_classifier::classify_reqwest_error;
use super::request_builder::{build_client, build_request};
use super::response_parser::parse_response;

/// Core HTTP engine. Executes a request and returns the response.
pub struct HttpEngine;

impl HttpEngine {
    /// Send an HTTP request and return the parsed response.
    pub async fn send(params: SendRequestParams) -> Result<ResponseData, HttpEngineError> {
        let timeout_ms = params.timeout_ms.unwrap_or(30_000);

        let client = build_client(&params)?;
        let request = build_request(&client, &params)?;

        let start = Instant::now();

        let response = request
            .send()
            .await
            .map_err(|e| classify_reqwest_error(e, timeout_ms))?;

        let elapsed_ms = start.elapsed().as_millis() as u64;

        parse_response(response, elapsed_ms).await
    }
}
