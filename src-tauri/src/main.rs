#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use tauri::{Runtime, Window, Manager};
use async_graphql::{Schema, EmptySubscription};
use async_graphql_warp::graphql;
use warp::Filter;
use std::convert::Infallible;
use neo4rs::*;
use std::sync::Arc;
use dotenv::dotenv;
use async_openai::Client;

mod database;
mod section;
mod query_root;
mod mutation_root;

use crate::database::Database;
use crate::query_root::QueryRoot;
use crate::mutation_root::MutationRoot;

type MySchema = Schema<QueryRoot, MutationRoot, EmptySubscription>;

#[allow(dead_code)]
pub enum ToolbarThickness {
    Thick,
    Medium,
    Thin,
}

pub trait WindowExt {
    #[cfg(target_os = "macos")]
    fn set_transparent_titlebar(&self);
}

impl<R: Runtime> WindowExt for Window<R> {
    #[cfg(target_os = "macos")]
    fn set_transparent_titlebar(&self) {
        use cocoa::appkit::{NSWindow, NSWindowTitleVisibility};

        unsafe {
            let id = self.ns_window().unwrap() as cocoa::base::id;

            id.setTitlebarAppearsTransparent_(cocoa::base::YES);

            id.setTitleVisibility_(NSWindowTitleVisibility::NSWindowTitleHidden);
            make_toolbar(id);
        }
    }
}

#[cfg(target_os = "macos")]
unsafe fn make_toolbar(id: cocoa::base::id) {
    use cocoa::appkit::{NSToolbar, NSWindow};

    let new_toolbar = NSToolbar::alloc(id);
    new_toolbar.init_();
    id.setToolbar_(new_toolbar);
}

#[tokio::main]
async fn main() {
    dotenv().ok();
    tokio::spawn(async {
        let uri = std::env::var("NEO4J_URI").expect("NEO4J_URI must be set.");
        let user = std::env::var("NEO4J_USER").expect("NEO4J_USER must be set.");
        let pass = std::env::var("NEO4J_PASSWORD").expect("NEO4J_PASSWORD must be set.");

        let openai_key = std::env::var("OPENAI_KEY").expect("OPENAI_KEY must be set.");
        let client = Client::new().with_api_key(openai_key);
        
        let graph = Graph::new(&uri, &user, &pass).await.unwrap();
        let database = Database { graph: Arc::new(graph) };
    
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
    });
  
    tauri::Builder::default()
      .setup(|app| {
        let win = app.get_window("main").unwrap();
        win.set_transparent_titlebar();
        Ok(())
      })
      .run(tauri::generate_context!())
      .expect("error while running tauri application");
}
