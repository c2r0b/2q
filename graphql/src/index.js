const { Neo4jGraphQL } = require("@neo4j/graphql");
const { ApolloServer, gql } = require("apollo-server");
const neo4j = require("neo4j-driver");

const typeDefs = gql`
	type Section {
  	id: ID!
		title: String!
	}
`;

const driver = neo4j.driver(
  "neo4j+s://01e5d20f.databases.neo4j.io",
  neo4j.auth.basic("neo4j", "2SR-25B-H_I_oM2CoD9PAqCU8dq1fHa-XuWGHEC4zGE")
);

const neoSchema = new Neo4jGraphQL({ typeDefs, driver });

neoSchema.getSchema().then((schema) => {
	const server = new ApolloServer({
		schema,
	});

	server.listen().then(({ url }) => {
		console.log(`🚀 Server ready at ${url}`);
	});
})