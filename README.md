# 2Q

2Q is an app for managing your business data and relationships.  
It is currently a work in progress, and is not ready for production use.

Current phase: **Proof of Concept**

## Tech Stack
* [Lit](https://lit.dev/) for [Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components) 
* [Apollo Client](https://www.apollographql.com/docs/react/) (GraphQL client)
* [GraphQL](https://graphql.org/)
* [Rust](https://www.rust-lang.org/) (GraphQL server)
* [Neo4J](https://neo4j.com/) (graph database)
* [Auth0](https://auth0.com/) (authentication)
* [Web test runner](https://modern-web.dev/docs/test-runner/overview/) (testing)
* [FontAwesome](https://fontawesome.com/) (icons)
* [Tailwind](https://tailwindcss.com/) (CSS)
* [Tauri](https://tauri.studio/en/) (desktop app)

## To Do
- [ ] Remove Auth0 dependency
- [ ] [GPT-3](https://openai.com/blog/openai-api/) (natural language processing)

## Development

### Requirements
 - [Node](https://nodejs.org/en/) (v18.x) with [npm](https://www.npmjs.com/)
 - [Rust](https://www.rust-lang.org/) (v1.55.x)
 - [Neo4J Community Edition](https://neo4j.com/download-center/#community) (v4.3.x)

### Installation
	npm install

### Start development
	npm run tauri dev

### Environment variables
`.env` files are used to store environment variables. Settings example:

	# .env
	NEO4J_URI=bolt://localhost:7687
	NEO4J_USER=neo4j
	NEO4J_PASSWORD=neo4j