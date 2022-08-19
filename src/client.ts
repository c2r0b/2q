import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';

import { locationVar } from './router';
import { selMovie } from './cache';

const uri = 'http://localhost:4000/graphql';

export const httpLink = new HttpLink({ uri });

// authenticatin JWT tokens
const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  let token = localStorage.getItem('token');
  token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJCb2JMb2JsYXc3Njg3Iiwicm9sZXMiOlsiYWRtaW4iXSwiaWF0IjoxNTE2MjM5MDIyfQ.f2GKIu31gz39fMJwj5_byFCMDPDy3ncdWOIhhqcwBxk"
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