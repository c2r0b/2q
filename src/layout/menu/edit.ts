import { ApolloMutationController } from '@apollo-elements/core';
import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { UpdateSections } from './mutations/UpdateSections.mutation.graphql.js';

@customElement('edit-btn')
export class EditButton extends LitElement {
  @property() private sectionId: number;

  updateSectionsMutation = new ApolloMutationController(this, UpdateSections)

  private async _handleEditClick() {
    const newTitle = prompt("Enter new section name");
    if (!newTitle) {
      alert("Invalid section name");
      return;
    }
    if (!this.sectionId) {
      return;
    }
    this.updateSectionsMutation.variables = {
      where: {
        id: this.sectionId
      },
      update: {
        title: newTitle
      }
    };
    await this.updateSectionsMutation.mutate();
    this.dispatchEvent(new CustomEvent('edit',{}));
  }
  
  protected render() {
    return html`
      <button
        type="button"
        @click="${this._handleEditClick}"
      >
        Edit
      </button>
    `;
  }
}
