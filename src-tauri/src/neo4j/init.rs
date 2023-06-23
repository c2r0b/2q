use neo4rs::*;
use async_graphql::{Schema, EmptySubscription};
use async_graphql_warp::graphql;
use std::convert::Infallible;
use async_openai::Client;
use warp::{cors, Filter};
use std::sync::Arc;

use crate::neo4j::database::Database;
use crate::neo4j::query_root::QueryRoot;
use crate::neo4j::mutation_root::MutationRoot;

use crate::settings::get::db_credentials;

type MySchema = Schema<QueryRoot, MutationRoot, EmptySubscription>;

async fn get_db()-> Result<Database> {
    let (uri, user, pass) = match db_credentials().await {
        Ok((uri, user, pass)) => (uri, user, pass),
        Err(e) => {
            println!("Error: {}", e);
            std::process::exit(1);
        }
    };
    let graph = neo4rs::Graph::new(&uri, &user, &pass).await?;
    let database = Database { graph: Arc::new(graph) };
    Ok(database)
}

pub async fn init(client: Client) {
    let database = get_db().await.unwrap();

    let schema = Schema::build(QueryRoot, MutationRoot, EmptySubscription)
        .data(database)
        .data(client)
        .finish();
    
    let cors = warp::cors()
        .allow_any_origin()
        .allow_methods(vec!["GET", "POST", "DELETE"])
        .allow_headers(vec!["content-type", "authorization"]);

    let graphql_post = graphql(schema.clone()).and_then(|(schema, request): (MySchema, async_graphql::Request)| async move {
        Ok::<_, Infallible>(async_graphql_warp::GraphQLResponse::from(
            schema.execute(request).await,
        ))
    }).with(cors);

    warp::serve(graphql_post).run(([127, 0, 0, 1], 8000)).await;
}