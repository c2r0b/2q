use async_graphql::{Context};
use async_openai::{
    types::{ChatCompletionRequestMessageArgs, CreateChatCompletionRequestArgs, Role},
    Client,
};
use async_graphql::Result;

pub async fn send_chat_message(ctx: &Context<'_>, message: String) -> Result<String> {
    let client = ctx.data::<Client>()?;

    let request = CreateChatCompletionRequestArgs::default()
        .model("gpt-3.5-turbo")
        .max_tokens(512u16)
        .messages([
            ChatCompletionRequestMessageArgs::default()
                .role(Role::User)
                .content(&message)
                .build()?
        ])
        .build()?;

    let response = client.chat().create(request).await?;

    let response_text = response
        .choices
        .first()
        .ok_or_else(|| async_graphql::Error::new("No response from OpenAI"))?
        .message
        .content
        .clone();

    Ok(response_text)
}
