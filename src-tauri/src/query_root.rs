use async_graphql::{Context, Object};
use neo4rs::*;

use crate::database::Database;
use crate::section::Section;

pub struct QueryRoot;

#[Object]
impl QueryRoot {
  async fn sections(&self, ctx: &Context<'_>) -> Vec<Section> {
      let data = ctx.data::<Database>().unwrap();
      let graph = data.graph.clone();
      
      let mut result = graph.execute(
          query("MATCH (s:Section) RETURN s")
      ).await.unwrap();

      let mut sections = vec![];

      while let Ok(Some(row)) = result.next().await {
          let node: Node = row.get("s").unwrap();
          let id: String = node.get("id").unwrap();
          let title: String = node.get("title").unwrap();

          sections.push(Section { id, title });
      }

      sections
  }
}
