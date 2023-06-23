use arangors::{Connection, ClientError};
use async_graphql::{Schema, EmptySubscription};
use async_graphql_warp::graphql;
use std::convert::Infallible;
use async_openai::Client;
use warp::{cors, Filter};

use crate::arangodb::query_root::QueryRoot;
use crate::arangodb::mutation_root::MutationRoot;

use crate::settings::get::db_credentials;

type MySchema = Schema<QueryRoot, MutationRoot, EmptySubscription>;

async fn get_conn()-> Result<Connection, ClientError> {
    let (uri, user, pass) = match db_credentials().await {
        Ok((uri, user, pass)) => (uri, user, pass),
        Err(e) => {
            println!("Error: {}", e);
            std::process::exit(1);
        }
    };
    let conn = Connection::establish_jwt(&uri, &user, &pass).await?;
    Ok(conn)
}

pub async fn init(client: Client) {
    let conn = match get_conn().await {
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


