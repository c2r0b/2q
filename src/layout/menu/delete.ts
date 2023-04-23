import { ApolloMutationController, ApolloQueryController } from '@apollo-elements/core';
import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { DeleteSections } from './mutations/DeleteSections.mutation.graphql.js';

@customElement('delete-btn')
export class DeleteButton extends LitElement {
  @property() private sectionId: number;

  deleteSectionsMutation = new ApolloMutationController(this, DeleteSections)
  
  private async _handleDeleteClick() {
    if (!this.sectionId) {
      return;
    }
    if (confirm("Are you sure you want to delete this?")) {
      this.deleteSectionsMutation.variables = {
        where: {
          id: this.sectionId
        }
      };
      await this.deleteSectionsMutation.mutate();
      this.dispatchEvent(new CustomEvent('delete',{}));
    }
  }
  
  protected render() {
    return html`
      <button
        type="button"
        @click="${this._handleDeleteClick}"
      >
        Delete
      </button>
    `;
  }
}
