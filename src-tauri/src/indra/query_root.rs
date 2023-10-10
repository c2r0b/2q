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

        // Here's where your query logic would start to differ significantly, since
        // graph databases don't typically allow for the same kind of ad-hoc querying
        // as document stores. This is a simple example where we might fetch all
        // vertices of type "Section" and filter them in application code, which may
        // not be practical for larger datasets.
        let q = RangeVertexQuery {
            limit: 4_294_967_294u32,
            t: Some(Identifier::new("Section").unwrap()),
            start_id: None,
        }
        .into();

        let result: Vec<QueryOutputValue> = db.get(q).unwrap();
        let vertices = indradb::util::extract_vertices(result).unwrap();

        let mut sections = vec![];

        for vertex in vertices {
            // You would have to define how to convert a Vertex into a Section.
            // This would depend on how you choose to store properties in your vertices.
            // Note that IndraDB does not support filtering by properties or fetching
            // properties in a single query, so you may have to perform additional queries
            // or fetch the desired properties in application code.
            
            let id = vertex.id.to_string(); // Using UUID as id
            // You might have properties like title, etc. stored in the vertex, which you'll need to fetch separately.

            let title = "SomeTitle".to_string(); // Placeholder: Replace this according to your model
            
            sections.push(Section { id, title });
        }

        // If you have filters, you might need to apply them here, in your application code,
        // since IndraDB might not be able to apply these filters in the database queries directly.
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
