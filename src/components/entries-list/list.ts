import { ApolloQueryController } from '@apollo-elements/core';
import { LitElement, html } from 'lit';
import { property, state } from 'lit-element';
import { customElement } from 'lit/decorators.js';

import { ListQuery } from './List.query.graphql.js';

@customElement('entries-list')
export class List extends LitElement {
  @property({}) set section(section: String) {
    this._section = section;
    this.getData();
  }
  private _section: String = "";

  query = new ApolloQueryController(this, ListQuery, {
    variables: this.getVariables()
  });

  getVariables() {
    return {
      where: {
        title: this._section
      }
    };
  }

  getData() {
    this.query.refetch(this.getVariables());
  }

  render() {
    const actors = this.query?.data?.movies[0]?.actors ?? [];
    return html`
      <dl>
        <p>${this._section}</p>
        <ul>${actors.map(actor => html`
          <li>${actor.name ?? ''}</li>
        `)}
        </ul>
      </dl>
    `;
  }
}
