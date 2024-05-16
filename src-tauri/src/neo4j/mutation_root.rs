use async_graphql::{Context, FieldResult, Object};
use neo4rs::*;

use crate::gpt::chat::send_chat_message;
use crate::neo4j::database::Database;
use crate::schema::section::{
    CreateResults, DeleteResults, Info, SectionCreateInput, SectionDeleteWhere, SectionUpdateInput,
    SectionUpdateWhere, UpdateResults,
};

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
        let graph = data.graph.clone();

        let mut nodes_created = 0;

        for section in input {
            let mut result = graph.execute(
              query("CREATE (s:Section { id: $id, title: $title, description: $description }) RETURN s")
              .param("id", section.id)
              .param("title", section.title)
              .param("description", section.description)
          ).await?;

            if let Ok(Some(_)) = result.next().await {
                nodes_created += 1;
            }
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
        let graph = data.graph.clone();

        let mut result = graph
            .execute(query("MATCH (s:Section) WHERE s.id = $id DELETE s").param("id", &*r#where.id))
            .await?;

        let mut nodes_deleted = 0;
        while let Ok(Some(_)) = result.next().await {
            nodes_deleted += 1;
        }

        Ok(DeleteResults { nodes_deleted })
    }

    async fn update_sections(
        &self,
        ctx: &Context<'_>,
        r#where: SectionUpdateWhere,
        update: SectionUpdateInput,
    ) -> FieldResult<UpdateResults> {
        let data = ctx.data::<Database>()?;
        let graph = data.graph.clone();

        let mut result = graph
            .execute(
                query(
                    "MATCH (s:Section) WHERE s.id = $where_id SET s.title = $update_title RETURN s",
                )
                .param("where_id", &*r#where.id)
                .param("update_title", &*update.title),
            )
            .await?;

        let mut nodes_created = 0;
        while let Ok(Some(_)) = result.next().await {
            nodes_created += 1;
        }

        Ok(UpdateResults {
            info: Info { nodes_created },
        })
    }
}
