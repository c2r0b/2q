import { ApolloMutationController, ApolloQueryController } from '@apollo-elements/core';
import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { v4 as uuid } from 'uuid';

import { faPlus } from '@fortawesome/free-solid-svg-icons';

import { CreateSections } from './mutations/CreateSections.mutation.graphql.js';

import shared from "../shared.css";

@customElement('add-btn')
export class AddButton extends LitElement {
  static readonly styles = [shared];

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
      <div class="tooltip" data-tip="Add new section">
        <button class="btn btn-circle" @click="${this._handleAddClick}">
          <fa-icon .icon=${faPlus}  class="h-6 w-6"></fa-icon>
        </button>
      </div>
    `;
  }
}
