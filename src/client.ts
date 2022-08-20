import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';

import { locationVar } from './router';
import { selMovie } from './cache';

const uri = 'http://localhost:4000/graphql';

export const httpLink = new HttpLink({ uri });

// authentication JWT tokens
const authLink = setContext(async (_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('token');

  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
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
  link: authLink.concat(httpLink)
});