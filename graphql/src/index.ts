import { ApolloServer } from "apollo-server";

import { Neo4jGraphQL } from "@neo4j/graphql";
import { Neo4jGraphQLAuthJWTPlugin } from "@neo4j/graphql-plugin-auth";
import neo4j from "neo4j-driver";

import { typeDefs } from "./schema";

// setup neo4j connection parameters
const driver = neo4j.driver(
  "neo4j+s://01e5d20f.databases.neo4j.io",
  neo4j.auth.basic("neo4j", "2SR-25B-H_I_oM2CoD9PAqCU8dq1fHa-XuWGHEC4zGE")
);

// init neo4j connection
const neoSchema = new Neo4jGraphQL({
  typeDefs,
  driver,
  plugins: {
    auth: new Neo4jGraphQLAuthJWTPlugin({
      secret: "super-secret"
    })
  }
});

// function to retrieve a user object given a token
const getUser = (token) => {
  return { isAuthenticated: true };
};

// startup server
neoSchema.getSchema().then((schema) => {
	const server = new ApolloServer({
		schema,
    context: ({ req }) => {
      // get the user token from the headers.
      const token = req.headers.authorization || '';
   
      // try to retrieve a user with the token
      const user = getUser(token);
      
      // add the user to the context
      return { user };
    },
	});

	server.listen().then(({ url }) => {
		console.log(`🚀 Server ready at ${url}`);
	});
});