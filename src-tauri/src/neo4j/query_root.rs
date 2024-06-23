use async_graphql::{Context, Object};
use neo4rs::*;

use crate::neo4j::database::Database;
use crate::schema::column::{Column, ColumnWhere};
use crate::schema::section::{Section, SectionWhere};

pub struct QueryRoot;

#[Object]
impl QueryRoot {
    async fn has_timetravel_support(&self, _ctx: &Context<'_>) -> bool {
        false
    }

    async fn sections(&self, ctx: &Context<'_>, r#where: Option<SectionWhere>) -> Vec<Section> {
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
            }
            None => "MATCH (s:Section) RETURN s".to_string(),
        };

        let mut result = graph.execute(query(&cypher_query)).await.unwrap();

        let mut sections = vec![];

        while let Ok(Some(row)) = result.next().await {
            let node: Node = row.get("s").unwrap();
            let id: String = node.get("id").unwrap();
            let title: String = node.get("title").unwrap();

            sections.push(Section { id, title });
        }

        sections
    }

    // get columns starting from a section_id
    async fn columns(&self, ctx: &Context<'_>, r#where: Option<ColumnWhere>) -> Vec<Column> {
        let data = ctx.data::<Database>().unwrap();
        let graph = data.graph.clone();

        let cypher_query = match &r#where {
            Some(filter) => {
                let mut query = "MATCH (c:Column)".to_string();
                if let Some(s) = &filter.section_id {
                    query = format!("{} WHERE c.section_id = '{}'", query, s);
                }
                if let Some(t) = &filter.title {
                    query = format!("{} WHERE toLower(c.title) CONTAINS toLower('{}')", query, t);
                }
                query.push_str(" RETURN c");
                query
            }
            None => "MATCH (c:Column) RETURN c".to_string(),
        };

        let mut result = graph.execute(query(&cypher_query)).await.unwrap();

        let mut columns = vec![];

        while let Ok(Some(row)) = result.next().await {
            let node: Node = row.get("c").unwrap();
            let id: String = node.get("id").unwrap();
            let section_id: String = node.get("section_id").unwrap();
            let title: String = node.get("title").unwrap();

            columns.push(Column {
                id,
                section_id,
                title,
            });
        }

        columns
    }
}
