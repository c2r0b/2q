use async_graphql::{EmptySubscription, Schema};
use async_graphql_warp::graphql;
use async_openai::{config::OpenAIConfig, Client};
use neo4rs::*;
use std::convert::Infallible;
use std::sync::Arc;
use tokio::sync::{broadcast, mpsc};
use tokio::time::{self, Duration};
use warp::{cors, Filter};

use crate::neo4j::database::Database;
use crate::neo4j::mutation_root::MutationRoot;
use crate::neo4j::query_root::QueryRoot;
use crate::schema::utils::Payload;

use crate::settings::get::db_credentials;

type MySchema = Schema<QueryRoot, MutationRoot, EmptySubscription>;

async fn get_db(signal: broadcast::Sender<()>) -> Result<Database> {
    let (uri, user, pass) = match db_credentials().await {
        Ok((uri, user, pass)) => (uri, user, pass),
        Err(e) => {
            println!("Error: {}", e);
            std::process::exit(1);
        }
    };

    const RETRY_INTERVAL: u64 = 5; // Retry every 5 seconds

    loop {
        match neo4rs::Graph::new(&uri, &user, &pass).await {
            Ok(graph) => {
                // Try to execute a simple query to verify the connection
                let test_query = "RETURN 1";
                match graph.execute(query(test_query)).await {
                    Ok(_) => {
                        // Query succeeded, database is ready
                        let database = Database {
                            graph: Arc::new(graph),
                        };
                        match signal.send(()) {
                            Ok(_) => {}
                            Err(e) => {
                                println!("Failed to send signal: {}. Continuing...", e);
                            }
                        }
                        return Ok(database);
                    }
                    Err(e) => {
                        // Query failed, database is not ready
                        println!("Failed to verify connection to Neo4j: {}. Retrying...", e);
                        time::sleep(Duration::from_secs(RETRY_INTERVAL)).await; // Retry after 5 seconds
                    }
                }
            }
            Err(e) => {
                println!(
                    "Failed to establish connection to Neo4j: {}. Retrying...",
                    e
                );
                time::sleep(Duration::from_secs(RETRY_INTERVAL)).await; // Retry after 5 seconds
            }
        }
    }
}

pub async fn init(client: Client<OpenAIConfig>, tx: mpsc::Sender<Payload>) {
    let (signal_sender, _) = broadcast::channel::<()>(1024);

    let database = match get_db(signal_sender.clone()).await {
        Ok(database) => database,
        Err(e) => {
            eprintln!("Failed to establish connection to Neo4j: {:?}", e);
            return;
        }
    };

    let schema = Schema::build(QueryRoot, MutationRoot, EmptySubscription)
        .data(database)
        .data(client)
        .finish();

    let cors = cors()
        .allow_any_origin()
        .allow_methods(vec!["GET", "POST", "DELETE"])
        .allow_headers(vec!["content-type", "authorization"]);

    let graphql_post = graphql(schema.clone())
        .and_then(
            |(schema, request): (MySchema, async_graphql::Request)| async move {
                Ok::<_, Infallible>(async_graphql_warp::GraphQLResponse::from(
                    schema.execute(request).await,
                ))
            },
        )
        .with(cors);

    // send a signal to the frontend using Tauri's event system
    if let Err(e) = tx
        .send(Payload::new("Neo4J successfully connected".into()))
        .await
    {
        eprintln!("Failed to send message: {:?}", e);
    }

    warp::serve(graphql_post).run(([127, 0, 0, 1], 8000)).await;
}
