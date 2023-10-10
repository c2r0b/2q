# 2Q

App for managing data and relationships.  

It is designed to be a **simple**, yet powerful tool for small businesses to manage their data using **natural language** processing to structure, insert and query data.

## Usage
### Installation
TODO

### Setup
TODO

## Development

### Requirements
 - [Node](https://nodejs.org/en/) (v18.x) with [npm](https://www.npmjs.com/)
 - [Rust](https://www.rust-lang.org/) (v1.55.x)

### Tech Stack
* [Lit](https://lit.dev/) for [Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components) 
* [Apollo Client](https://github.com/apollographql/apollo-client) with [GraphQL](https://graphql.org/)
* [GPT-3](https://openai.com/blog/openai-api/) (natural language processing)
* [Tauri](https://tauri.studio/en/) (desktop app) with [Rust](https://www.rust-lang.org/) (backend)
* [Tailwind](https://tailwindcss.com/) (CSS) with [FontAwesome](https://fontawesome.com/) (icons)
* [Storybook](https://storybook.js.org/) (component library)

### Database support
* [IndraDB](https://github.com/indradb/indradb) (embedded)
* [Neo4J](https://neo4j.com/) (external)
* [ArangoDB](https://www.arangodb.com/) (external)

### Start
	npm install
	npm run tauri dev
	npm run storybook # optional (component library)

### Environment variables
`.env` files are used to store environment variables. Settings example:

	DB_TYPE=arango|neo4j # external database type
	DB_URI=localhost:7687
	DB_USER=neo4j
	DB_PASSWORD=neo4j
	OPENAI_KEY=your-openai-key