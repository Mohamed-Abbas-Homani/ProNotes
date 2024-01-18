use serde::{Deserialize, Serialize};
use std::fs;

#[derive(Debug, Serialize, Deserialize)]
pub struct FrontendConfig {
    primary_color: String,
    secondary_color: String,
}

impl FrontendConfig {
    pub fn new(primary_color: &str, secondary_color: &str) -> Self {
        FrontendConfig {
            primary_color: primary_color.to_string(),
            secondary_color: secondary_color.to_string(),
        }
    }

    pub fn from_file(file_path: &str) -> Result<Self, Box<dyn std::error::Error>> {
        let content = fs::read_to_string(file_path)?;
        let config: FrontendConfig = serde_json::from_str(&content)?;
        Ok(config)
    }
}
