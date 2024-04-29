use async_graphql::Context;
use async_graphql::Result;
use async_openai::config::OpenAIConfig;
use async_openai::{
    types::{
        ChatCompletionRequestMessage, ChatCompletionRequestSystemMessageArgs,
        CreateChatCompletionRequestArgs,
    },
    Client,
};

pub async fn send_chat_message(ctx: &Context<'_>, message: String) -> Result<String> {
    let client = ctx.data::<Client<OpenAIConfig>>()?;

    let mut messages: Vec<ChatCompletionRequestMessage> = vec![];
    messages.push(
        ChatCompletionRequestSystemMessageArgs::default()
            .content(message)
            .build()
            .unwrap()
            .into(),
    );

    let request = CreateChatCompletionRequestArgs::default()
        .model("gpt-3.5-turbo")
        .max_tokens(512u16)
        .messages(messages)
        .build()?;

    let response = client.chat().create(request).await?;

    let response_text = response
        .choices
        .first()
        .ok_or_else(|| async_graphql::Error::new("No response from OpenAI"))?
        .message
        .content
        .clone()
        .unwrap();

    Ok(response_text)
}
