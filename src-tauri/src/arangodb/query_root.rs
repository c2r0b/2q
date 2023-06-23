use async_graphql::{Context, Object};
use arangors::{Document};

use crate::arangodb::conn::get_conn;
use crate::schema::section::Section;

pub struct QueryRoot;

#[Object]
impl QueryRoot {
    async fn has_timetravel_support(&self, ctx: &Context<'_>) -> bool {
        true
    }

    async fn sections(&self, ctx: &Context<'_>) -> Vec<Section> {
        let conn = get_conn().await.unwrap();
        let db = conn.db("toq").await.unwrap();

        // create collection if it doesn't exist
        if db.collection("Section").await.is_err() {
            let _ = db.create_collection("Section").await.unwrap();
        }
        
        let collection = db.collection("Section").await.unwrap();
        let cursor: Vec<Document<Section>> = db.aql_str("FOR s IN Section RETURN s").await.unwrap();

        let mut sections = vec![];

        for doc in cursor {
            let id = doc.document.id.clone();
            let title = doc.document.title.clone();
        
            sections.push(Section { id, title });
        }

        sections
    }
}
