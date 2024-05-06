import { ApolloMutationController } from "@apollo-elements/core";
import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { faEdit } from "@fortawesome/free-solid-svg-icons";

import { UpdateSections } from "./mutations/UpdateSections.mutation.graphql.js";

import "../../../shared/ui/button/index.js";

@customElement("edit-btn")
export class EditButton extends LitElement {
  @property() private sectionId: number;

  updateSectionsMutation = new ApolloMutationController(this, UpdateSections);

  private async _handleEditClick() {
    const newTitle = "EDIT";
    if (!newTitle) {
      alert("Invalid section name");
      return;
    }
    if (!this.sectionId) {
      return;
    }
    this.updateSectionsMutation.variables = {
      where: {
        id: this.sectionId,
      },
      update: {
        title: newTitle,
      },
    };
    await this.updateSectionsMutation.mutate();
    this.dispatchEvent(new CustomEvent("edit", {}));
  }

  protected render() {
    return html`
      <qui-button
        aria-label="Edit section"
        .icon="${faEdit}"
        @click="${this._handleEditClick}"
      />
    `;
  }
}
