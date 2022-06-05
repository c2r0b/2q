import { ApolloMutationController, ApolloQueryController } from '@apollo-elements/core';
import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { v4 as uuid } from 'uuid';

import { CreateSections } from './mutations/CreateSections.mutation.graphql.js';

@customElement('add-btn')
export class AddButton extends LitElement {
  createSectionsMutation = new ApolloMutationController(this, CreateSections)

  private async _handleAddClick(e) {
    const title = prompt("New section name");
    if (!title) {
      alert("Invalid section name");
      return;
    }
    this.createSectionsMutation.variables = {
      input: [
        {
          id: uuid(),
          title
        }
      ]
    };
    await this.createSectionsMutation.mutate();
    this.dispatchEvent(new CustomEvent('add',{}));
  }
  
  render() {
    return html`
      <button
        type="button"
        @click="${this._handleAddClick}"
      >
        Add
      </button>
    `;
  }
}
