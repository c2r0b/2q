use arangors::{Connection, ClientError};
use async_graphql::{Schema, EmptySubscription};
use async_graphql_warp::graphql;
use std::convert::Infallible;
use async_openai::Client;
use warp::{cors, Filter};
use tokio::sync::{broadcast, mpsc};
use std::time::Duration;

use crate::arangodb::query_root::QueryRoot;
use crate::arangodb::mutation_root::MutationRoot;

use crate::settings::get::db_credentials;
use crate::schema::utils::Payload;

type MySchema = Schema<QueryRoot, MutationRoot, EmptySubscription>;

async fn get_conn(signal: broadcast::Sender<()>) -> Result<Connection, ClientError> {
    let (uri, user, pass) = match db_credentials().await {
        Ok((uri, user, pass)) => (uri, user, pass),
        Err(e) => {
            println!("Error: {}", e);
            std::process::exit(1);
        }
    };

    loop {
        match Connection::establish_jwt(&uri, &user, &pass).await {
            Ok(conn) => {
                match signal.send(()) {
                    Ok(_) => {},
                    Err(e) => {
                        println!("Failed to send signal: {}. Continuing...", e);
                    }
                }
                return Ok(conn);
            }
            Err(e) => {
                println!("Failed to establish connection: {}. Retrying...", e);
                tokio::time::sleep(Duration::from_secs(5)).await; // Retry after 5 seconds
            }
        }
    }
}

pub async fn init(client: Client, tx: mpsc::Sender<Payload>) {
    let (signal_sender, _) = broadcast::channel::<()>(1024);

    let conn = match get_conn(signal_sender.clone()).await {
        Ok(connection) => connection,
        Err(e) => {
            eprintln!("Failed to establish connection: {:?}", e);
            return;
        }
    };

    // check if database exists, if not create it
    let databases = conn.accessible_databases().await.unwrap();
    if !databases.contains_key(&"toq".to_string()) {
        conn.create_database("toq").await.unwrap();
    }
    let database = conn.db("toq").await.unwrap();

    let schema = Schema::build(QueryRoot, MutationRoot, EmptySubscription)
        .data(database)
        .data(client)
        .finish();

    let cors = cors()
        .allow_any_origin()
        .allow_methods(vec!["GET", "POST", "DELETE"])
        .allow_headers(vec!["content-type", "authorization"]);

    let graphql_post = graphql(schema.clone()).and_then(|(schema, request): (MySchema, async_graphql::Request)| async move {
        Ok::<_, Infallible>(async_graphql_warp::GraphQLResponse::from(
            schema.execute(request).await,
        ))
    }).with(cors);

    // send a signal to the frontend using Tauri's event system
    if let Err(e) = tx.send(Payload::new("ArangoDB successfully connected".into())).await {
        eprintln!("Failed to send message: {:?}", e);
    }

    warp::serve(graphql_post).run(([127, 0, 0, 1], 8000)).await;
}


