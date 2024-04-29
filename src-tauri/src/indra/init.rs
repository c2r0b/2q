use async_graphql::{EmptySubscription, Schema};
use async_graphql_warp::graphql;
use async_openai::{config::OpenAIConfig, Client};
use indradb::{Identifier, MemoryDatastore, Transaction, Vertex};
use std::convert::Infallible;
use std::sync::Arc;
use tokio::sync::{broadcast, mpsc};
use warp::{cors, Filter};

use crate::indra::database::Database;
use crate::indra::mutation_root::MutationRoot;
use crate::indra::query_root::QueryRoot;
use crate::schema::utils::Payload;

type MySchema = Schema<QueryRoot, MutationRoot, EmptySubscription>;

async fn get_db(signal: broadcast::Sender<()>) -> Result<Database, String> {
    // RETRY_INTERVAL may be used if you implement retry logic for indradb setup
    const RETRY_INTERVAL: u64 = 5;

    // Here setup your indradb connection (depending on your actual datastore)
    let datastore: indradb::Database<MemoryDatastore> = MemoryDatastore::new_db();

    // Example test query: creating a vertex (adjust accordingly)
    let vertex_type = Identifier::new("test").map_err(|e| format!("Identifier error: {:?}", e))?;
    let vertex = Vertex::new(vertex_type);
    datastore
        .create_vertex(&vertex)
        .map_err(|e| format!("Failed to create vertex: {:?}", e))?;

    // If no error, setup the Database struct (you may need to define it)
    let database = Database {
        graph: Arc::new(datastore),
    };

    match signal.send(()) {
        Ok(_) => {}
        Err(e) => {
            println!("Failed to send signal: {}. Continuing...", e);
        }
    }

    Ok(database)
}

pub async fn init(client: Client<OpenAIConfig>, tx: mpsc::Sender<Payload>) {
    let (signal_sender, _) = broadcast::channel::<()>(1024);

    let database = match get_db(signal_sender.clone()).await {
        Ok(database) => database,
        Err(e) => {
            eprintln!("Failed to establish connection to IndraDB: {:?}", e);
            std::process::exit(1);
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
        .send(Payload::new("IndraDB successfully connected".into()))
        .await
    {
        eprintln!("Failed to send message: {:?}", e);
    }

    warp::serve(graphql_post).run(([127, 0, 0, 1], 8000)).await;
}
