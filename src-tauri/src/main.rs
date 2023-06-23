#![cfg_attr(
all(not(debug_assertions), target_os = "windows"),
windows_subsystem = "windows"
)]

use tauri::{Runtime, Window, Manager};
use dotenv::dotenv;
use async_openai::Client;
use std::env;

mod arangodb;
mod neo4j;
mod gpt;
mod schema;
mod settings;

use crate::neo4j::init::init as init_neo4j;
use crate::arangodb::init::init as init_arango;

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
        let openai_key = env::var("OPENAI_KEY").expect("OPENAI_KEY must be set.");
        let client = Client::new().with_api_key(openai_key);
    
        // support for multiple database types (arango, neo4j)
        let db_type = env::var("DB_TYPE").expect("DB_TYPE must be set.");
        if db_type == "arango" {
            init_arango(client).await;
        }
        else if db_type == "neo4j" {
            init_neo4j(client).await;
        }
        else {
            panic!("DB_TYPE must be set to either 'arango' or 'neo4j'.");
        }
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
