use std::env;
use std::error::Error;

pub async fn db_credentials() -> Result<(String, String, String), Box<dyn Error>> {
    let uri = env::var("DB_URI").map_err(|_| "DB_URI must be set.")?;
    let user = env::var("DB_USER").map_err(|_| "DB_USER must be set.")?;
    let pass = env::var("DB_PASSWORD").map_err(|_| "DB_PASSWORD must be set.")?;

    Ok((uri, user, pass))
}