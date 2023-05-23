use neo4rs::*;
use std::sync::Arc;

#[derive(Clone)]
pub struct Database {
    pub graph: Arc<Graph>,
}
