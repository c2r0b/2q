use serde::Serialize;

impl Payload {
    pub fn new(message: String) -> Self {
        Payload { message }
    }
}

#[derive(Clone, Debug, Serialize)]
pub struct Payload {
  message: String,
}