use async_graphql::{Context, Object};
use neo4rs::*;

use crate::neo4j::database::Database;
use crate::schema::section::{Section, SectionFilter};

pub struct QueryRoot;

#[Object]
impl QueryRoot {
    async fn has_timetravel_support(&self, ctx: &Context<'_>) -> bool {
        false
    }

    async fn sections(&self, ctx: &Context<'_>, r#where: Option<SectionFilter>) -> Vec<Section> {
      let data = ctx.data::<Database>().unwrap();
      let graph = data.graph.clone();

      let cypher_query = match &r#where {
        Some(filter) => {
            let mut query = "MATCH (s:Section)".to_string();
            if let Some(t) = &filter.title {
                query = format!("{} WHERE toLower(s.title) CONTAINS toLower('{}')", query, t);
            }
            if let Some(i) = &filter.id {
                query = format!("{} WHERE s.id = '{}'", query, i);
            }
            query.push_str(" RETURN s");
            query
        },
        None => "MATCH (s:Section) RETURN s".to_string(),
      };

      let mut result = graph.execute(
          query(&cypher_query)
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
