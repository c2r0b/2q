import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client/core';

import { locationVar } from './router';
import { selMovie } from './cache';

const uri = 'http://127.0.0.1:8000';

export const httpLink = new HttpLink({
  uri
});

const cache =
  new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          location(): Location {
            return locationVar();
          },
          selMovie: {
            read() {
              const sel = selMovie();
              if (sel) return sel;
              return locationVar().pathname?.replace("%20", " ")?.substring(1);
            }
          }
        },
      },
    },
  });

export const client = new ApolloClient({
  cache,
  link: httpLink,
});