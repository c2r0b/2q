use async_graphql::{Context, FieldResult, Object};

use crate::gpt::chat::send_chat_message;
use crate::indra::database::Database;
use crate::schema::section::{
    CreateResults, DeleteResults, Info, SectionCreateInput, SectionDeleteWhere, SectionUpdateInput,
    SectionUpdateWhere, UpdateResults,
};
use indradb::{BulkInsertItem, Identifier, Json, SpecificVertexQuery, Vertex};
use uuid::Uuid;

pub struct MutationRoot;

#[Object]
impl MutationRoot {
    async fn send_chat_message(
        &self,
        ctx: &Context<'_>,
        message: String,
    ) -> async_graphql::Result<String> {
        send_chat_message(ctx, message).await
    }

    async fn create_sections(
        &self,
        ctx: &Context<'_>,
        input: Vec<SectionCreateInput>,
    ) -> FieldResult<CreateResults> {
        let data = ctx.data::<Database>()?;
        let store = data.graph.clone();

        let vertex_type = Identifier::new("Section")?;

        let mut nodes_created = 0;

        for section in input {
            let uuid = Uuid::parse_str(&section.id)?;
            let vertex = BulkInsertItem::Vertex(Vertex::with_id(uuid, vertex_type));

            let property = BulkInsertItem::VertexProperty(
                uuid,
                Identifier::new("title")?,
                Json::new(serde_json::Value::String(section.title.clone())),
            );

            store.bulk_insert(vec![vertex, property]);
            nodes_created += 1;
        }

        Ok(CreateResults {
            info: Info { nodes_created },
        })
    }

    async fn delete_sections(
        &self,
        ctx: &Context<'_>,
        r#where: SectionDeleteWhere,
    ) -> FieldResult<DeleteResults> {
        let data = ctx.data::<Database>()?;
        let store = data.graph.clone();

        let uuid = Uuid::parse_str(&r#where.id)?;
        let q = SpecificVertexQuery::single(uuid);

        store.delete(q);

        Ok(DeleteResults { nodes_deleted: 1 })
    }

    async fn update_sections(
        &self,
        ctx: &Context<'_>,
        r#where: SectionUpdateWhere,
        update: SectionUpdateInput,
    ) -> FieldResult<UpdateResults> {
        Ok(UpdateResults {
            info: Info { nodes_created: 0 },
        })
    }
}
