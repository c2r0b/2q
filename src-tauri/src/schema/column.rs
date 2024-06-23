use async_graphql::{InputObject, Object, SimpleObject};
use serde::{Deserialize, Serialize};

#[derive(Clone, Serialize, Deserialize)]
pub struct Column {
    pub id: String,
    pub section_id: String,
    pub title: String,
}

#[Object]
impl Column {
    async fn id(&self) -> &str {
        &self.id
    }

    async fn section_id(&self) -> &str {
        &self.section_id
    }

    async fn title(&self) -> &str {
        &self.title
    }
}

#[derive(InputObject, Clone, Serialize, Deserialize)]
pub struct ColumnCreateInput {
    pub id: String,
    pub section_id: String,
    pub title: String,
}

#[derive(InputObject, Debug)]
pub struct ColumnWhere {
    pub section_id: Option<String>,
    pub title: Option<String>,
    pub id: Option<String>,
}
