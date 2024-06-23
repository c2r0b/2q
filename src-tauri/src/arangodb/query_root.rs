use arangors::Document;
use async_graphql::{Context, Object};

use crate::arangodb::conn::get_conn;
use crate::schema::column::{Column, ColumnWhere};
use crate::schema::section::{Section, SectionWhere};

pub struct QueryRoot;

#[Object]
impl QueryRoot {
    async fn has_timetravel_support(&self, _ctx: &Context<'_>) -> bool {
        true
    }

    async fn sections(&self, _ctx: &Context<'_>, r#where: Option<SectionWhere>) -> Vec<Section> {
        let conn = get_conn().await.unwrap();
        let db = conn.db("toq").await.unwrap();

        // create collection if it doesn't exist
        if db.collection("Section").await.is_err() {
            let _ = db.create_collection("Section").await.unwrap();
        }

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
            }
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

    async fn columns(&self, _ctx: &Context<'_>, r#where: Option<ColumnWhere>) -> Vec<Column> {
        let conn = get_conn().await.unwrap();
        let db = conn.db("toq").await.unwrap();

        // create collection if it doesn't exist
        if db.collection("Column").await.is_err() {
            let _ = db.create_collection("Column").await.unwrap();
        }

        let query = match &r#where {
            Some(filter) => {
                let mut query = "FOR c IN Column".to_string();
                if let Some(s) = &filter.section_id {
                    query = format!("{} FILTER c.section_id == '{}'", query, s);
                }
                if let Some(t) = &filter.title {
                    query = format!("{} FILTER CONTAINS(LOWER(c.title), LOWER('{}'))", query, t);
                }
                query.push_str(" RETURN c");
                query
            }
            None => "FOR c IN Column RETURN c".to_string(),
        };

        let cursor: Vec<Document<Column>> = db.aql_str(&query).await.unwrap();

        let mut columns = vec![];

        for doc in cursor {
            let id = doc.document.id.clone();
            let section_id = doc.document.section_id.clone();
            let title = doc.document.title.clone();

            columns.push(Column {
                id,
                section_id,
                title,
            });
        }

        columns
    }
}
