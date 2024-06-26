use async_graphql::{InputObject, Object, SimpleObject};
use serde::{Deserialize, Serialize};

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

#[derive(InputObject, Clone, Serialize, Deserialize)]
pub struct SectionCreateInput {
    pub id: String,
    pub title: String,
    pub description: String,
}

#[derive(InputObject, Debug)]
pub struct SectionWhere {
    pub title: Option<String>,
    pub id: Option<String>,
}

#[derive(InputObject)]
pub struct SectionUpdateWhere {
    pub id: String,
}

#[derive(InputObject)]
pub struct SectionDeleteWhere {
    pub id: String,
}

#[derive(InputObject)]
pub struct SectionUpdateInput {
    pub title: String,
}
