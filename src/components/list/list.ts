import { ApolloQueryController } from '@apollo-elements/core';
import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { ListQuery } from './queries/List.query.graphql.js';

@customElement('entries-list')
export class List extends LitElement {
  @property({}) set sectionId(id: String) {
    this._sectionId = id;
    this.updateData();
  }
  private _sectionId: String = "";

  query = new ApolloQueryController(this, ListQuery, {
    variables: this.getVariables()
  });

  private getVariables() {
    return {
      where: {
        id: this._sectionId
      }
    };
  }

  private updateData() {
    this.query.refetch(this.getVariables());
  }

  render() {
    const sub = this.query?.data?.sections[0];
    return html`
      <dl>
        <p>${this._sectionId}</p>
        <p>${sub?.title}</p>
      </dl>
    `;
  }
}
