use async_graphql::{Context, Object};
use arangors::{Document};

use crate::arangodb::conn::get_conn;
use crate::schema::section::{Section, SectionFilter};

pub struct QueryRoot;

#[Object]
impl QueryRoot {
    async fn has_timetravel_support(&self, ctx: &Context<'_>) -> bool {
        true
    }

    async fn sections(&self, ctx: &Context<'_>, r#where: Option<SectionFilter>) -> Vec<Section> {
        let conn = get_conn().await.unwrap();
        let db = conn.db("toq").await.unwrap();

        // create collection if it doesn't exist
        if db.collection("Section").await.is_err() {
            let _ = db.create_collection("Section").await.unwrap();
        }

        let collection = db.collection("Section").await.unwrap();
        let query = match &r#where {
            Some(filter) => {
                let mut query = "FOR s IN Section".to_string();
                if let Some(t) = &filter.title {
                    query = format!("{} FILTER CONTAINS(LOWER(s.title), LOWER('{}'))", query, t);
                }
                if let Some(i) = &filter.id {
                    query = format!("{} FILTER s._key == '{}'", query, i);
                }
                query.push_str(" RETURN s");
                query
            },
            None => "FOR s IN Section RETURN s".to_string(),
        };

        let cursor: Vec<Document<Section>> = db.aql_str(&query).await.unwrap();


        let mut sections = vec![];

        for doc in cursor {
            let id = doc.document.id.clone();
            let title = doc.document.title.clone();
        
            sections.push(Section { id, title });
        }

        sections
    }
}
