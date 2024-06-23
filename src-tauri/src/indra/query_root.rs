use async_graphql::{Context, Object};
use indradb::{Datastore, Identifier, QueryOutputValue, RangeVertexQuery, Transaction};

use crate::indra::database::Database;
use crate::schema::column::{Column, ColumnWhere};
use crate::schema::section::{Section, SectionWhere};

pub struct QueryRoot;

#[Object]
impl QueryRoot {
    async fn has_timetravel_support(&self, ctx: &Context<'_>) -> bool {
        false
    }

    async fn sections(&self, ctx: &Context<'_>, r#where: Option<SectionWhere>) -> Vec<Section> {
        let data = ctx.data::<Database>().unwrap();
        let store: std::sync::Arc<indradb::Database<indradb::MemoryDatastore>> = data.graph.clone();

        let q: RangeVertexQuery = RangeVertexQuery {
            limit: 4_294_967_294u32,
            t: Some(Identifier::new("Section").unwrap()),
            start_id: None,
        }
        .into();

        let result: Vec<QueryOutputValue> = store.get(q).unwrap();

        let transaction = store.datastore.transaction();
        let vertices = indradb::util::extract_vertices(result).unwrap();
        let mut sections = vec![];

        for vertex in vertices {
            let id = vertex.id.to_string();

            let title_identifier = Identifier::new("title").unwrap();
            let title_json: Option<indradb::Json> = transaction
                .vertex_property(&vertex, title_identifier)
                .unwrap();
            let title = serde_json::to_string(&title_json).unwrap();

            sections.push(Section { id, title });
        }

        if let Some(filter) = r#where {
            sections = sections
                .into_iter()
                .filter(|section| {
                    let mut is_match = true;
                    if let Some(ref t) = filter.title {
                        is_match &= section.title.to_lowercase().contains(&t.to_lowercase());
                    }
                    if let Some(ref i) = filter.id {
                        is_match &= section.id == *i;
                    }
                    is_match
                })
                .collect();
        }

        sections
    }

    async fn columns(&self, ctx: &Context<'_>, r#where: Option<ColumnWhere>) -> Vec<Column> {
        let data = ctx.data::<Database>().unwrap();
        let store: std::sync::Arc<indradb::Database<indradb::MemoryDatastore>> = data.graph.clone();

        let q: RangeVertexQuery = RangeVertexQuery {
            limit: 4_294_967_294u32,
            t: Some(Identifier::new("Column").unwrap()),
            start_id: None,
        }
        .into();

        let result: Vec<QueryOutputValue> = store.get(q).unwrap();

        let transaction = store.datastore.transaction();
        let vertices = indradb::util::extract_vertices(result).unwrap();
        let mut columns = vec![];

        for vertex in vertices {
            let id = vertex.id.to_string();

            let section_id_identifier = Identifier::new("section_id").unwrap();
            let section_id_json: Option<indradb::Json> = transaction
                .vertex_property(&vertex, section_id_identifier)
                .unwrap();
            let section_id = serde_json::to_string(&section_id_json).unwrap();

            let title_identifier = Identifier::new("title").unwrap();
            let title_json: Option<indradb::Json> = transaction
                .vertex_property(&vertex, title_identifier)
                .unwrap();
            let title = serde_json::to_string(&title_json).unwrap();

            columns.push(Column {
                id,
                section_id,
                title,
            });
        }

        if let Some(filter) = r#where {
            columns = columns
                .into_iter()
                .filter(|column| {
                    let mut is_match = true;
                    if let Some(ref t) = filter.title {
                        is_match &= column.title.to_lowercase().contains(&t.to_lowercase());
                    }
                    if let Some(ref i) = filter.id {
                        is_match &= column.id == *i;
                    }
                    if let Some(ref s) = filter.section_id {
                        is_match &= column.section_id == *s;
                    }
                    is_match
                })
                .collect();
        }

        columns
    }
}
