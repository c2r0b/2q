use async_graphql::{Context, Object};
use indradb::{Identifier, VertexProperties, RangeVertexQuery, QueryOutputValue};

use crate::indra::database::Database;
use crate::schema::section::{Section, SectionFilter};

pub struct QueryRoot;

#[Object]
impl QueryRoot {
    async fn has_timetravel_support(&self, ctx: &Context<'_>) -> bool {
        false
    }

    async fn sections(&self, ctx: &Context<'_>, r#where: Option<SectionFilter>) -> Vec<Section> {
        let data = ctx.data::<Database>().unwrap();
        let db = data.graph.clone();

        let q:RangeVertexQuery = RangeVertexQuery {
            limit: 4_294_967_294u32,
            t: Some(Identifier::new("Section").unwrap()),
            start_id: None,
        }
        .into();

        let result: Vec<QueryOutputValue> = db.get(q).unwrap();
        let vertices = indradb::util::extract_vertices(result).unwrap();

        let mut sections = vec![];

        for vertex in vertices {
            
            // TODO
            let id = vertex.id.to_string();
            let title = "SomeTitle".to_string();
            
            sections.push(Section { id, title });
        }

        if let Some(filter) = r#where {
            sections = sections.into_iter().filter(|section| {
                let mut is_match = true;
                if let Some(ref t) = filter.title {
                    is_match &= section.title.to_lowercase().contains(&t.to_lowercase());
                }
                if let Some(ref i) = filter.id {
                    is_match &= section.id == *i;
                }
                is_match
            }).collect();
        }

        sections
    }
}
