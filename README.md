# 2Q

2Q is an app for managing your business data and relationships.  
It is currently a work in progress, and is not ready for production use.

Current phase: **Proof of Concept**

## Tech Stack
* [Lit](https://lit.dev/) for [Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components) 
* [Apollo](https://www.apollographql.com/) (both client and server) with [GraphQL](https://graphql.org/)
* [Neo4J](https://neo4j.com/) (graph database)
* [Auth0](https://auth0.com/) (authentication)
* [Web test runner](https://modern-web.dev/docs/test-runner/overview/) (testing)
* [FontAwesome](https://fontawesome.com/) (icons)
* [Tailwind](https://tailwindcss.com/) (CSS)
* [Tauri](https://tauri.studio/en/) (desktop app)

## To Do
- [ ] [Tauri Sidecar NodeJS](https://github.com/tauri-apps/tauri/tree/dev/examples/sidecar)
- [ ] Neo4J Community Edition as a bin with Tauri sidecar
- [ ] Remove Auth0 to have a completely standalone app
- [ ] [GPT-3](https://openai.com/blog/openai-api/) (natural language processing)

## Development

### Requirements
 - [Node](https://nodejs.org/en/) (v18.x) with [npm](https://www.npmjs.com/)

### Installation
	npm install

### Start development
	cd graphql/ && npm run build 
	cd ../ && npm run package
	npm run tauri dev

### Start frontend
	npm run start

### Start backend
	cd graphql
	npm run start
