use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type", rename_all = "kebab-case")]
pub enum AuthConfig {
    None,
    Bearer {
        token: String,
    },
    Basic {
        username: String,
        password: String,
    },
    ApiKey {
        key: String,
        value: String,
        /// "header" or "query"
        #[serde(default = "default_header")]
        add_to: ApiKeyLocation,
    },
    Oauth2 {
        grant_type: OAuth2GrantType,
        #[serde(default)]
        auth_url: String,
        #[serde(default)]
        token_url: String,
        #[serde(default)]
        client_id: String,
        #[serde(default)]
        client_secret: String,
        #[serde(default)]
        scope: String,
        #[serde(default = "default_callback_url")]
        callback_url: String,
        #[serde(default)]
        username: String,
        #[serde(default)]
        password: String,
        #[serde(default = "default_true")]
        use_pkce: bool,
    },
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "kebab-case")]
pub enum ApiKeyLocation {
    #[default]
    Header,
    Query,
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "snake_case")]
pub enum OAuth2GrantType {
    #[default]
    AuthorizationCode,
    ClientCredentials,
    Implicit,
    Password,
}

fn default_header() -> ApiKeyLocation {
    ApiKeyLocation::Header
}

fn default_callback_url() -> String {
    "http://localhost:9876/callback".to_string()
}

fn default_true() -> bool {
    true
}
