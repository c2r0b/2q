import { ApolloMutationController } from "@apollo-elements/core";
import { html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { v4 as uuid } from "uuid";
import { StyledElement } from "../../shared/styled.element";
import { emit } from "@tauri-apps/api/event";

import "@carbon/web-components/es/components/button/index.js";
import "@carbon/web-components/es/components/text-input/index.js";
import "@carbon/web-components/es/components/textarea/index.js";
import "@carbon/web-components/es/components/modal/index.js";

import { SendChatMessage } from "../../shared/mutations/SendChatMessage.mutation.graphql";
import { CreateSections } from "./mutations/CreateSections.mutation.graphql";

@customElement("modal-add-section")
export class AddSection extends StyledElement() {
  @property({ type: Boolean, attribute: "open" })
  private open: boolean = false;

  @state() private sectionTitle: string = "";
  @state() private sectionDescription: string = "";
  @state() private sectionParent: string = "";

  sendChatMessageMutation = new ApolloMutationController(this, SendChatMessage);
  createSectionsMutation = new ApolloMutationController(this, CreateSections);

  private _handleTitleInput(e) {
    this.sectionTitle = (e.detail.value as string) || "";
  }

  private _handleDescriptionInput(e) {
    this.sectionDescription = (e.detail.value as string) || "";
  }

  private async _handleProceed() {
    if (!this.sectionTitle) {
      alert("Invalid section name");
      return;
    }
    if (!this.sectionDescription) {
      alert("Invalid section description");
      return;
    }

    // generate mutation from gpt
    this.sendChatMessageMutation.variables = {
      message: this.sectionDescription,
    };
    let chatReply;
    try {
      const chatMutationResponse = await this.sendChatMessageMutation.mutate();
      chatReply = chatMutationResponse.data.sendChatMessage;
    } catch (e) {
      alert("Failed to generate section settings" + e.message);
      return;
    }

    // add section to the database
    this.createSectionsMutation.variables = {
      input: [
        {
          id: uuid(),
          title: this.sectionTitle,
          description: chatReply,
        },
      ],
    };
    try {
      await this.createSectionsMutation.mutate();
    } catch (e) {
      alert("Failed to create section: " + e.message);
      return;
    }

    await emit("section-created");
    // TODO: close the dialog
  }

  private isLoading() {
    return (
      this.sendChatMessageMutation.loading ||
      this.createSectionsMutation.loading
    );
  }

  private _handleClose() {
    this.open = false;
    this.dispatchEvent(new CustomEvent("closed", {}));
  }

  protected render() {
    return html`
      <cds-modal
        id="add-section"
        ?open=${this.open}
        @cds-modal-closed=${this._handleClose}
      >
        <cds-modal-body>
          <div class="flex flex-row gap-3">
            <qui-field label="Title">
              <cds-text-input
                placeholder="Section title"
                ?disabled=${this.isLoading()}
                value=${this.sectionTitle}
                @new-value=${this._handleTitleInput}
              ></cds-text-input>
            </qui-field>
            <qui-field label="Icon">
              <qui-icon-picker></qui-icon-picker>
            </qui-field>
            <cds-select
              label-text="Parent"
              ?disabled=${this.isLoading()}
              .value=${this.sectionParent}
            >
              <option value="0">None</option>
            </cds-select>
          </div>
          <cds-textarea
            placeholder="Create a new section to..."
            ?disabled=${this.isLoading()}
            @new-value=${this._handleDescriptionInput}
          ></cds-textarea>
        </cds-modal-body>
        <cds-modal-footer>
          <cds-button
            aria-label="Save section"
            ?disabled=${this.isLoading()}
            @click=${() => this._handleProceed()}
          >
            Proceed
          </cds-button>
          <qui-loader ?hidden=${!this.isLoading()}></qui-loader>
        </cds-modal-footer>
      </cds-modal>
    `;
  }
}