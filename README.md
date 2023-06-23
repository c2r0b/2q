# 2Q

2Q is an app for managing your business data and relationships.  
It is currently a work in progress, and is not ready for production use.

Current phase: **Proof of Concept**

## Tech Stack
* [Lit](https://lit.dev/) for [Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components) 
* [Apollo Client](https://github.com/apollographql/apollo-client) with [GraphQL](https://graphql.org/)
* [Neo4J](https://neo4j.com/) or [ArangoDB](https://www.arangodb.com/) (graph databases)
* [GPT-3](https://openai.com/blog/openai-api/) (natural language processing)
* [Tauri](https://tauri.studio/en/) (desktop app) with [Rust](https://www.rust-lang.org/) (backend)
* [Tailwind](https://tailwindcss.com/) (CSS) with [FontAwesome](https://fontawesome.com/) (icons)
* [Storybook](https://storybook.js.org/) (component library)

## Development

### Requirements
 - [Node](https://nodejs.org/en/) (v18.x) with [npm](https://www.npmjs.com/)
 - [Rust](https://www.rust-lang.org/) (v1.55.x)
 - [Neo4J](https://neo4j.com/download-center/#community) (v4.3.x) or [ArangoDB](https://www.arangodb.com/download-major/) (v3.12.x)

### Installation
	npm install

### Start development
	npm run tauri dev

### Start Storybook (optional)
	npm run storybook

### Start database (optional)
Start Neo4J or ArangoDB, and set the database connection settings in `.env` (see below).

### Environment variables
`.env` files are used to store environment variables. Settings example:

	# .env
	DB_TYPE=arango|neo4j
	DB_URI=bolt://localhost:7687
	DB_USER=neo4j
	DB_PASSWORD=neo4j
	OPENAI_KEY=your-openai-key