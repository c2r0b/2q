import { ApolloMutationController } from '@apollo-elements/core';
import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { v4 as uuid } from 'uuid';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { WebviewWindow } from '@tauri-apps/api/window';

import { CreateSections } from './mutations/CreateSections.mutation.graphql.js';

import '../../../../ui/button/button';

@customElement('add-btn')
export class AddButton extends LitElement {
  @state() private sectionTitle: string = "";

  static readonly styles = [];

  createSectionsMutation = new ApolloMutationController(this, CreateSections)

  private async _handleAddClick(e) {
    const webview = new WebviewWindow('addNewSection', {
      url: '/add-section',
      width: 650,
      height: 400,
    });
    // emit an event to the backend
    await webview.emit("addSectionDone", "data");
    // listen to an event from the backend
    const unlisten = await webview.listen("addSectionDone", e => {});
    unlisten();

    return;
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
        <qui-button
          .icon="${faPlus}"
          @click="${this._handleAddClick}"
        >
          Delete
        </qui-button>
      </div>
    `;
  }
}
