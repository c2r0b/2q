use async_graphql::SimpleObject;

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
