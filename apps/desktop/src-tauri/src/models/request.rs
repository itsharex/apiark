use serde::{Deserialize, Serialize};

use super::auth::AuthConfig;

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "UPPERCASE")]
#[allow(clippy::upper_case_acronyms)]
pub enum HttpMethod {
    #[default]
    GET,
    POST,
    PUT,
    PATCH,
    DELETE,
    HEAD,
    OPTIONS,
}

impl HttpMethod {
    pub fn to_reqwest(&self) -> reqwest::Method {
        match self {
            HttpMethod::GET => reqwest::Method::GET,
            HttpMethod::POST => reqwest::Method::POST,
            HttpMethod::PUT => reqwest::Method::PUT,
            HttpMethod::PATCH => reqwest::Method::PATCH,
            HttpMethod::DELETE => reqwest::Method::DELETE,
            HttpMethod::HEAD => reqwest::Method::HEAD,
            HttpMethod::OPTIONS => reqwest::Method::OPTIONS,
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "kebab-case")]
pub enum BodyType {
    Json,
    Xml,
    FormData,
    Urlencoded,
    Raw,
    Binary,
    #[default]
    None,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct KeyValuePair {
    pub key: String,
    pub value: String,
    #[serde(default = "default_true")]
    pub enabled: bool,
}

fn default_true() -> bool {
    true
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct RequestBody {
    #[serde(rename = "type")]
    pub body_type: BodyType,
    #[serde(default)]
    pub content: String,
    /// Form-data fields (used when body_type is FormData)
    #[serde(default)]
    pub form_data: Vec<KeyValuePair>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ProxyConfig {
    pub url: String,
    pub username: Option<String>,
    pub password: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SendRequestParams {
    pub method: HttpMethod,
    pub url: String,
    #[serde(default)]
    pub headers: Vec<KeyValuePair>,
    #[serde(default)]
    pub params: Vec<KeyValuePair>,
    pub body: Option<RequestBody>,
    pub auth: Option<AuthConfig>,
    pub proxy: Option<ProxyConfig>,
    /// Request timeout in milliseconds
    pub timeout_ms: Option<u64>,
    /// Whether to follow redirects (default: true)
    #[serde(default = "default_true")]
    pub follow_redirects: bool,
    /// Whether to verify SSL certificates (default: true)
    #[serde(default = "default_true")]
    pub verify_ssl: bool,
    /// Per-request cookie overrides
    #[serde(default)]
    pub cookies: Option<std::collections::HashMap<String, String>>,
}
