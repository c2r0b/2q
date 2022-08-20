import dotenv from "dotenv";
dotenv.config();

import { ApolloServer, AuthenticationError, gql } from "apollo-server";

import { Neo4jGraphQL } from "@neo4j/graphql";
import neo4j from "neo4j-driver";

import isTokenValid from "./validate";

import fs from "fs";
import path from "path";

const gqlWrapper = (...files) => {
  return gql`${files}`;
};

const importFile = (file) => {
  return fs.readFileSync(path.join(__dirname, file),"utf-8");
};

// function that imports .graphql files
const importGql = (file) => {
  return gqlWrapper(importFile(file));
};

// db auth
const neo4jAuth = neo4j.auth.basic(
  process.env.NEO4J_USER,
  process.env.NEO4J_KEY
);

// setup neo4j connection parameters
const driver = neo4j.driver(
  process.env.NEO4J_URI,
  neo4jAuth
);

// load schema
const typeDefs = importGql("./schema.graphql");

// init neo4j connection
const neoSchema = new Neo4jGraphQL({
  typeDefs,
  driver
});


// startup server
neoSchema.getSchema().then((schema) => {
	const server = new ApolloServer({
		schema,
    context: async ({ req }) => {
      const token = req.headers.authorization;
      const { error } = await isTokenValid(token);

      if (error) {
        throw new AuthenticationError(error);
      }
      
      return { req }
    },
	});

	server.listen().then(({ url }) => {
		console.log(`🚀 Server ready at ${url}`);
	});
});