import { ApolloMutationController, ApolloQueryController } from '@apollo-elements/core';
import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { selMovie } from '../../cache.js';
import { v4 as uuid } from 'uuid';

import { MenuQuery } from './queries/Menu.query.graphql.js';
import { CreateSections } from './mutations/CreateSections.mutation.graphql.js';

@customElement('side-menu')
export class Menu extends LitElement {
  @property() private canEdit: boolean = false;

  query = new ApolloQueryController(this, MenuQuery);
  createSectionsMutation = new ApolloMutationController(this, CreateSections)
  
  // on section change
  private onMenuEntryClick(path) {
    //window.history.pushState({}, '', '/' + path);
    //selMovie(path);
    this.dispatchEvent(new CustomEvent('sectionChange',{
      detail: { message: path }
    }));
  }

  private updateData() {
    this.query.refetch();
  }

  private async _handleAddClick(e) {
    const title = prompt("New section name");
    if (title) {
      this.createSectionsMutation.variables = {
        input: [
          {
            id: uuid(),
            title
          }
        ]
      };
      await this.createSectionsMutation.mutate();
      this.updateData();
    }
  }
  
  render() {
    const sections = this.query.data?.sections ?? [];
    return html`
      <dl>
        <ul>
          ${sections.map(s => {
            return html`
              <li @click="${() => this.onMenuEntryClick(s.id)}">
                ${s.title}
              </li>
            `;
          })}
        </ul>
        <button
          type="button"
          ?hidden=${!this.canEdit}
          @click="${this._handleAddClick}"
        >
          Add
        </button>
      </dl>
    `;
  }
}
