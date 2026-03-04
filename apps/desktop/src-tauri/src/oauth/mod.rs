pub mod callback;
pub mod flow;

use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::sync::Mutex;

/// Cached OAuth token.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct OAuthToken {
    pub access_token: String,
    pub refresh_token: Option<String>,
    pub expires_at: Option<i64>, // unix timestamp (seconds)
    pub token_type: String,
}

impl OAuthToken {
    pub fn is_expired(&self) -> bool {
        match self.expires_at {
            Some(exp) => chrono::Utc::now().timestamp() >= exp,
            None => false, // no expiry = never expires
        }
    }
}

/// Token status for UI display.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct OAuthTokenStatus {
    pub has_token: bool,
    pub is_expired: bool,
    pub expires_at: Option<i64>,
    pub token_type: Option<String>,
}

/// In-memory token store, keyed by "{client_id}:{auth_url}".
pub struct OAuthTokenStore {
    pub tokens: Mutex<HashMap<String, OAuthToken>>,
}

impl OAuthTokenStore {
    pub fn new() -> Self {
        Self {
            tokens: Mutex::new(HashMap::new()),
        }
    }

    pub fn cache_key(client_id: &str, auth_url: &str) -> String {
        format!("{}:{}", client_id, auth_url)
    }

    pub fn get(&self, key: &str) -> Option<OAuthToken> {
        self.tokens.lock().unwrap().get(key).cloned()
    }

    pub fn set(&self, key: String, token: OAuthToken) {
        self.tokens.lock().unwrap().insert(key, token);
    }

    pub fn remove(&self, key: &str) {
        self.tokens.lock().unwrap().remove(key);
    }
}
