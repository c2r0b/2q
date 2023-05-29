import { ApolloMutationController } from '@apollo-elements/core';
import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { confirm } from '@tauri-apps/api/dialog';
import { faRemove } from '@fortawesome/free-solid-svg-icons';

import { DeleteSections } from './mutations/DeleteSections.mutation.graphql.js';

import '../../../../ui/button/button';

@customElement('delete-btn')
export class DeleteButton extends LitElement {
  @property() private sectionId: number;

  deleteSectionsMutation = new ApolloMutationController(this, DeleteSections)
  
  private async _handleDeleteClick() {
    if (!this.sectionId) {
      return;
    }
    if (await confirm("Are you sure you want to delete this?")) {
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
      <qui-button
        .icon="${faRemove}"
        @click="${this._handleDeleteClick}"
      >
        Delete
      </qui-button>
    `;
  }
}
