import { ApolloMutationController } from '@apollo-elements/core';
import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { v4 as uuid } from 'uuid';

import { faPlus } from '@fortawesome/free-solid-svg-icons';

import { CreateSections } from './mutations/CreateSections.mutation.graphql.js';

@customElement('add-btn')
export class AddButton extends LitElement {
  @state() private sectionTitle: string = "";

  static readonly styles = [];

  createSectionsMutation = new ApolloMutationController(this, CreateSections)

  private async _handleAddClick(e) {
    if (!this.sectionTitle) {
      alert("Invalid section name");
      return;
    }
    this.createSectionsMutation.variables = {
      input: [
        {
          id: uuid(),
          title: this.sectionTitle
        }
      ]
    };
    this.sectionTitle = "";
    await this.createSectionsMutation.mutate();
    this.dispatchEvent(new CustomEvent('add',{}));
  }
  
  protected render() {
    return html`
      <div class="tooltip" data-tip="Add new section">
        <input
          type="text"
          placeholder="Add new section"
          .value="${this.sectionTitle}"
          @input="${e => this.sectionTitle = e.target.value}"
        />
        <button
          class="btn btn-circle"
          @click="${this._handleAddClick}"
        >
          <fa-icon .icon=${faPlus}  class="h-6 w-6"></fa-icon>
        </button>
      </div>
    `;
  }
}
