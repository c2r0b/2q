use async_graphql::{Object, InputObject, SimpleObject};
use serde::{Serialize, Deserialize};

#[derive(Clone, Serialize, Deserialize)]
pub struct Section {
    pub id: String,
    pub title: String,
}

#[Object]
impl Section {
    async fn id(&self) -> &str {
        &self.id
    }

    async fn title(&self) -> &str {
        &self.title
    }
}

// Define your input types
#[derive(InputObject, Clone, Serialize, Deserialize)]
pub struct SectionCreateInput {
    pub id: String,
    pub title: String,
    pub description: String,
}

#[derive(SimpleObject)]
pub struct CreateResults {
    pub info: Info,
}

#[derive(SimpleObject)]
pub struct Info {
    pub nodes_created: i32,
}

#[derive(SimpleObject)]
pub struct UpdateResults {
    pub info: Info,
}

#[derive(SimpleObject)]
pub struct DeleteResults {
    pub nodes_deleted: i32,
}

#[derive(InputObject)]
pub struct SectionWhere {
    pub id: String,
}

#[derive(InputObject)]
pub struct SectionUpdateInput {
    pub title: String,
}

#[derive(InputObject, Debug)]
pub struct SectionFilter {
    pub title: Option<String>,
    pub id: Option<String>,
}