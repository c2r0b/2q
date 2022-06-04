import { ApolloQueryController } from '@apollo-elements/core';
import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { selMovie } from '../../cache.js';

import { MenuQuery } from './Menu.query.graphql.js';

@customElement('side-menu')
export class Menu extends LitElement {
  query = new ApolloQueryController(this, MenuQuery);
  
  // on section change
  onMenuEntryClick(path) {
    window.history.pushState({}, '', '/' + path);
    selMovie(path);
    this.dispatchEvent(
      new CustomEvent('sectionChange',{
        detail: { message: path }
      })
    );
  }
  
  render() {
    const movies = this.query.data?.movies ?? [];
    return html`
      <dl>
        <ul>
          ${movies.map(movie => {
            const title = movie.title ?? '';
            return html`
              <li @click="${() => this.onMenuEntryClick(title)}">
                ${title}
              </li>
            `;
          })}
        </ul>
      </dl>
    `;
  }
}
