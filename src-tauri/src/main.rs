#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use async_graphql::{Context, EmptyMutation, EmptySubscription, Object, Schema};
use async_graphql_warp::graphql;
use warp::Filter;
use std::convert::Infallible;
use neo4rs::*;
use std::sync::Arc;

#[derive(Clone)]
struct Database {
    graph: Arc<Graph>,
}

struct QueryRoot;

#[Object]
impl QueryRoot {
    async fn sections(&self, ctx: &Context<'_>) -> Vec<Section> {
        let data = ctx.data::<Database>().unwrap();
        let graph = data.graph.clone();
        
        let mut result = graph.execute(
            query("MATCH (s:Section) RETURN s")
        ).await.unwrap();

        let mut sections = vec![];

        while let Ok(Some(row)) = result.next().await {
            let node: Node = row.get("s").unwrap();
            let id: String = node.get("id").unwrap();
            let title: String = node.get("title").unwrap();

            sections.push(Section { id, title });
        }

        sections
    }
}

#[derive(Clone)]
struct Section {
    id: String,
    title: String,
}

#[Object]
impl Section {
    async fn id(&self) -> &str {
        &self.id
    }

    async fn title(&self) -> &str {
        &self.title
    }
}

type MySchema = Schema<QueryRoot, EmptyMutation, EmptySubscription>;

#[tokio::main]
async fn main() {
    tokio::spawn(async {
        let uri = "localhost:7687";
        let user = "neo4j";
        let pass = "orlando-saddle-virgo-human-nylon-3697";
    
        let graph = Graph::new(&uri, user, pass).await.unwrap();
        let database = Database { graph: Arc::new(graph) };
    
        let schema = Schema::build(QueryRoot, EmptyMutation, EmptySubscription)
            .data(database)
            .finish();
    
        let cors = warp::cors()
            .allow_any_origin() // Be careful with this in a production application
            .allow_methods(vec!["GET", "POST", "DELETE"]) // You might need to adjust this depending on your needs
            .allow_headers(vec!["content-type", "authorization"]);
    
        let graphql_post = graphql(schema.clone()).and_then(|(schema, request): (MySchema, async_graphql::Request)| async move {
            Ok::<_, Infallible>(async_graphql_warp::GraphQLResponse::from(
                schema.execute(request).await,
            ))
        }).with(cors);
    
        warp::serve(graphql_post).run(([127, 0, 0, 1], 8000)).await;    
    });
  
    tauri::Builder::default()
      .run(tauri::generate_context!())
      .expect("error while running tauri application");
}