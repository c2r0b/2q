import '@apollo-elements/components/apollo-client';
import { ApolloClientElement } from '@apollo-elements/components/apollo-client';

import { client } from './client';

// icons setup
import { FontAwesomeIcon } from '@riovir/wc-fontawesome';
customElements.define('fa-icon', FontAwesomeIcon);

import './components/app';

const clientWrapper = document.getElementById('client') as ApolloClientElement;

clientWrapper.client = client;

customElements.whenDefined('gemo-app')
  .then(() => document.body.removeAttribute('unresolved'));
