#![cfg_attr(
all(not(debug_assertions), target_os = "windows"),
windows_subsystem = "windows"
)]

use tauri::{Runtime, Window, Manager};
use dotenv::dotenv;
use async_openai::Client;
use std::env;
use tokio::sync::mpsc;

mod indra;
mod arangodb;
mod neo4j;
mod gpt;
mod schema;
mod settings;

// database support
use crate::indra::init::init as init_indra;
use crate::neo4j::init::init as init_neo4j;
use crate::arangodb::init::init as init_arango;

use crate::schema::utils::Payload;

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

// initialize the db
#[tauri::command]
async fn init_db(window: tauri::Window) {
    // create a communication for the db init thread
    let (tx, mut rx) = mpsc::channel::<Payload>(1);

    tokio::spawn(async move {
        let openai_key = env::var("OPENAI_KEY").expect("OPENAI_KEY must be set.");
        let client = Client::new().with_api_key(openai_key);

        // support for multiple database types (arango, neo4j, indra)
        let db_type = env::var("DB_TYPE").ok().unwrap_or_else(|| "indra".to_string());
        if db_type == "arango" {
            init_arango(client, tx.clone()).await;
        }
        else if db_type == "neo4j" {
            init_neo4j(client, tx.clone()).await;
        }
        else {
            // use IndraDB locally
            init_indra(client, tx.clone()).await;
        }
    });

    // use the receiver here to prevent it from being dropped
    while let Some(payload) = rx.recv().await {
        println!("Received: {:?}", payload);
        window.emit("db-initialized", ()).unwrap();
    }
}

#[tokio::main]
async fn main() {
    dotenv().ok();

    tauri::Builder::default()
    .setup(|app| {
        let win = app.get_window("main").unwrap();
        win.set_transparent_titlebar();
        Ok(())
    })
    .plugin(tauri_plugin_context_menu::init())
    .invoke_handler(tauri::generate_handler![init_db])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
