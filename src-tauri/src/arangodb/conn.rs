use arangors::{Connection, ClientError};
use std::env;

pub async fn get_conn()-> Result<Connection, ClientError> {
    let uri = env::var("DB_URI").expect("DB_URI must be set.");
    let user = env::var("DB_USER").expect("DB_USER must be set.");
    let pass = env::var("DB_PASSWORD").expect("DB_PASSWORD must be set.");

    let conn = Connection::establish_jwt(&uri, &user, &pass).await?;
    Ok(conn)
}
