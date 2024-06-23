use arangors::document::options::{InsertOptions, RemoveOptions, UpdateOptions};
use arangors::Document;
use async_graphql::{Context, FieldResult, Object};
use serde::{Deserialize, Serialize};

use crate::arangodb::conn::get_conn;
use crate::gpt::chat::send_chat_message;
use crate::schema::column::ColumnCreateInput;
use crate::schema::results::{CreateResults, DeleteResults, Info, UpdateResults};
use crate::schema::section::{
    SectionCreateInput, SectionDeleteWhere, SectionUpdateInput, SectionUpdateWhere,
};

// TODO: remove
#[derive(Serialize, Deserialize)]
struct Section {
    _key: String,
    _id: String,
    id: String,
    title: String,
    description: String,
}

// TODO: remove
#[derive(Serialize, Deserialize)]
struct Column {
    _key: String,
    _id: String,
    id: String,
    section_id: String,
    title: String,
}

pub struct MutationRoot;

#[Object]
impl MutationRoot {
    async fn send_chat_message(
        &self,
        ctx: &Context<'_>,
        message: String,
    ) -> async_graphql::Result<String> {
        send_chat_message(ctx, message).await
    }

    async fn create_sections(
        &self,
        _ctx: &Context<'_>,
        input: Vec<SectionCreateInput>,
    ) -> FieldResult<CreateResults> {
        let db = get_conn().await?.db("toq").await.unwrap();
        let collection = db.collection("Section").await.unwrap();
        let mut nodes_created = 0;

        for section in input.clone() {
            let document = Document::new(Section {
                _key: section.id.clone(),
                _id: "".to_string(),
                id: section.id.clone(),
                title: section.title.clone(),
                description: section.description.clone(),
            });
            let _ = collection
                .create_document(document, InsertOptions::default())
                .await
                .unwrap();
            nodes_created += 1;
        }

        let nodes_created = input.len() as i32;
        let info = Info { nodes_created };
        let result = CreateResults { info };

        Ok(result)
    }

    async fn create_columns(
        &self,
        _ctx: &Context<'_>,
        input: Vec<ColumnCreateInput>,
    ) -> FieldResult<CreateResults> {
        let db = get_conn().await?.db("toq").await.unwrap();
        let collection = db.collection("Column").await.unwrap();
        let mut nodes_created = 0;

        for column in input.clone() {
            let document = Document::new(Column {
                _key: column.id.clone(),
                _id: "".to_string(),
                id: column.id.clone(),
                section_id: column.section_id.clone(),
                title: column.title.clone(),
            });
            let _ = collection
                .create_document(document, InsertOptions::default())
                .await
                .unwrap();
            nodes_created += 1;
        }

        let nodes_created = 0;
        let info = Info { nodes_created };
        let result = CreateResults { info };

        Ok(result)
    }

    async fn delete_sections(
        &self,
        _ctx: &Context<'_>,
        r#where: SectionDeleteWhere,
    ) -> FieldResult<DeleteResults> {
        let conn = get_conn().await?;
        let db = conn.db("toq").await.unwrap();
        let collection = db.collection("Section").await.unwrap();
        let _ = collection
            .remove_document::<Document<()>>(&r#where.id, RemoveOptions::default(), None)
            .await
            .unwrap();

        Ok(DeleteResults { nodes_deleted: 1 })
    }

    async fn update_sections(
        &self,
        _ctx: &Context<'_>,
        r#where: SectionUpdateWhere,
        update: SectionUpdateInput,
    ) -> FieldResult<UpdateResults> {
        let conn = get_conn().await?;
        let db = conn.db("toq").await.unwrap();
        let collection = db.collection("Section").await.unwrap();
        // debug id to console
        println!("id: {}", &r#where.id);

        let mut doc: Document<Section> = collection.document(&r#where.id).await.unwrap();
        doc.document.title = update.title.clone();
        let _ = collection
            .update_document(&r#where.id, doc.document, UpdateOptions::default())
            .await
            .unwrap();

        Ok(UpdateResults {
            info: Info { nodes_created: 1 },
        })
    }
}
