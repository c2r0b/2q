const { gql } = require('apollo-server');
const typeDefs = gql`
  type Muscle {
    id: ID!
    name: String
    description: String
    videos: [Video]
  }
  type Video {
    id: ID!
    name: String
    description: String
    videoLink: String
    imageLink: String
  }
  type Book {
    title: String
    author: String
  }
  type Query {
    muscles: [Muscle]!
    muscle(id: ID!): Muscle
    videos: [Video]!
    video(id: ID!): Video 
    books: [Book]
  }
`;
module.exports = typeDefs;