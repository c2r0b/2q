import { gql } from "apollo-server";

export const typeDefs = gql`
	type Section @auth(rules: [{ isAuthenticated: true }]) {
		id: ID!
		title: String!
	}
`;