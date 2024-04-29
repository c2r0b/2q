use indradb::MemoryDatastore;
use std::sync::Arc;

#[derive(Clone)]
pub struct Database {
    pub graph: Arc<indradb::Database<MemoryDatastore>>,
}
