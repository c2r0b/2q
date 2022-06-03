import { ApolloClient, InMemoryCache, HttpLink, gql } from '@apollo/client/core';

import { locationVar } from './router';

const uri = 'http://localhost:4000/graphql';

export const link = new HttpLink({ uri });

const cache =
  new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          location(): Location {
            return locationVar();
          },
        },
      },
    },
  });

export const client = new ApolloClient({ cache, link });


client
  .query({
    query: gql`
      query TestQuery {
        movies {
          title
          actors {
            name
          }
        }
      }
    `
  })
  .then(result => console.log(result));