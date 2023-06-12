use async_graphql::{Context, Object, FieldResult};
use neo4rs::*;

use async_openai::{
    types::{ChatCompletionRequestMessageArgs, CreateChatCompletionRequestArgs, Role},
    Client,
};

use crate::database::Database;
use crate::section::{SectionCreateInput, SectionWhere, SectionUpdateInput, CreateResults, UpdateResults, DeleteResults, Info};

pub struct MutationRoot;

#[Object]
impl MutationRoot {
    async fn send_chat_message(&self, ctx: &Context<'_>, message: String) -> async_graphql::Result<String> {
        let client = ctx.data::<Client>()?;

        let request = CreateChatCompletionRequestArgs::default()
            .model("gpt-3.5-turbo")
            .max_tokens(512u16)
            .messages([
                ChatCompletionRequestMessageArgs::default()
                    .role(Role::User)
                    .content(&message)
                    .build()?
            ])
            .build()?;

        let response = client.chat().create(request).await?;

        let response_text = response
            .choices
            .first()
            .ok_or_else(|| async_graphql::Error::new("No response from OpenAI"))?
            .message
            .content
            .clone();

        Ok(response_text)
    }

  async fn create_sections(&self, ctx: &Context<'_>, input: Vec<SectionCreateInput>) -> FieldResult<CreateResults> {
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

      Ok(CreateResults { info: Info { nodes_created } })
  }

  async fn delete_sections(&self, ctx: &Context<'_>, r#where: SectionWhere) -> FieldResult<DeleteResults> {
      let data = ctx.data::<Database>()?;
      let graph = data.graph.clone();
      
      let mut result = graph.execute(
          query("MATCH (s:Section) WHERE s.id = $id DELETE s")
          .param("id", &*r#where.id)
      ).await?;

      let mut nodes_deleted = 0;
      while let Ok(Some(_)) = result.next().await {
          nodes_deleted += 1;
      }

      Ok(DeleteResults { nodes_deleted })
  }

  async fn update_sections(&self, ctx: &Context<'_>, r#where: SectionWhere, update: SectionUpdateInput) -> FieldResult<UpdateResults> {
      let data = ctx.data::<Database>()?;
      let graph = data.graph.clone();
      
      let mut result = graph.execute(
          query("MATCH (s:Section) WHERE s.id = $where_id SET s.title = $update_title RETURN s")
          .param("where_id", &*r#where.id)
          .param("update_title", &*update.title)
      ).await?;

      let mut nodes_created = 0;
      while let Ok(Some(_)) = result.next().await {
          nodes_created += 1;
      }

      Ok(UpdateResults { info: Info { nodes_created } })
  }
}
