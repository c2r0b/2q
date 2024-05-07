import { ApolloMutationController } from "@apollo-elements/core";
import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { confirm } from "@tauri-apps/plugin-dialog";
import { faRemove } from "@fortawesome/free-solid-svg-icons";

import { DeleteSections } from "./mutations/DeleteSections.mutation.graphql.js";

import "@carbon/web-components/es/components/button/index.js";

@customElement("delete-btn")
export class DeleteButton extends LitElement {
  @property() private sectionId: number;

  deleteSectionsMutation = new ApolloMutationController(this, DeleteSections);

  private async _handleDeleteClick() {
    if (!this.sectionId) {
      return;
    }
    if (await confirm("Are you sure you want to delete this?")) {
      this.deleteSectionsMutation.variables = {
        where: {
          id: this.sectionId,
        },
      };
      await this.deleteSectionsMutation.mutate();
      this.dispatchEvent(new CustomEvent("delete", {}));
    }
  }

  protected render() {
    return html`
      <cds-button
        aria-label="Delete section"
        @click="${this._handleDeleteClick}"
      >
        <fa-icon .icon=${faRemove}></fa-icon>
      </cds-button>
    `;
  }
}
