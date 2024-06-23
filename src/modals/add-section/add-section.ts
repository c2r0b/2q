import { ApolloMutationController } from "@apollo-elements/core";
import { html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { v4 as uuid } from "uuid";
import { StyledElement } from "../../shared/styled.element";
import { emit } from "@tauri-apps/api/event";
import { t } from "src/locales";

import "@carbon/web-components/es/components/button/index.js";
import "@carbon/web-components/es/components/text-input/index.js";
import "@carbon/web-components/es/components/textarea/index.js";
import "@carbon/web-components/es/components/modal/index.js";

import { SendChatMessage } from "../../shared/mutations/SendChatMessage.mutation.graphql";
import { CreateSections } from "./mutations/CreateSections.mutation.graphql";
import { CreateColumns } from "./mutations/CreateColumns.mutation.graphql";

@customElement("modal-add-section")
export class AddSection extends StyledElement() {
  @property({ type: Boolean, attribute: "open" })
  private open: boolean = false;

  @state() private sectionTitle: string = "";
  @state() private sectionDescription: string = "";
  @state() private sectionParent: string = "";

  sendChatMessageMutation = new ApolloMutationController(this, SendChatMessage);
  createSectionsMutation = new ApolloMutationController(this, CreateSections);
  createColumnsMutation = new ApolloMutationController(this, CreateColumns);

  private _handleTitleInput(e) {
    this.sectionTitle = (e.target.value as string) || "";
  }

  private _handleDescriptionInput(e) {
    this.sectionDescription = (e.target.value as string) || "";
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
      message: `Column names for a table the manages this: ${this.sectionDescription}. Reply with comma separated column names, e.g.: name,age`,
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
    const sectionId = uuid();
    this.createSectionsMutation.variables = {
      input: [
        {
          id: sectionId,
          title: this.sectionTitle,
          description: this.sectionDescription
        },
      ],
    };
    try {
      await this.createSectionsMutation.mutate();
    } catch (e) {
      alert("Failed to create section: " + e.message);
      return;
    }

    // parse column names
    const columns = chatReply.split(",").map((name) => ({
      id: uuid(),
      sectionId: sectionId,
      title: name.trim(),
    }));

    console.log(columns)

    // add columns to the database
    this.createColumnsMutation.variables = {
      input: columns,
    };
    try {
      await this.createColumnsMutation.mutate();
    } catch (e) {
      alert("Failed to create columns: " + e.message);
      return;
    }
    
    await emit("section-created");

    this._handleClose();
    this.clearInputs();
  }

  private isLoading() {
    return (
      this.sendChatMessageMutation.loading ||
      this.createSectionsMutation.loading
    );
  }

  private clearInputs() {
    this.sectionTitle = "";
    this.sectionDescription = "";
  }

  private _handleClose() {
    this.open = false;
    this.dispatchEvent(new CustomEvent("closed", {}));
  }

  protected render() {
    return html`
      <cds-modal
        ?open=${this.open}
        full-width
        @cds-modal-closed=${this._handleClose}
        class="bg-white dark:bg-gray-800"
      >
        <cds-modal-header>
          <cds-modal-close-button></cds-modal-close-button>
          <cds-modal-label>${t("sections")}</cds-modal-label>
          <cds-modal-heading>${t("addCustomSection")}</cds-modal-heading>
        </cds-modal-header>
        <cds-modal-body>
          <div class="flex flex-row gap-3">
            <qui-field label="Title">
              <cds-text-input
                placeholder=${t("sectionTitlePlaceholder")}
                ?disabled=${this.isLoading()}
                value=${this.sectionTitle}
                @input=${this._handleTitleInput}
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
            placeholder=${t("sectionDescriptionPlaceholder")}
            value=${this.sectionDescription}
            ?disabled=${this.isLoading()}
            @input=${this._handleDescriptionInput}
          ></cds-textarea>
        </cds-modal-body>
        <cds-modal-footer>
          <cds-button
            aria-label=${t("proceed")}
            ?disabled=${this.isLoading()}
            @click=${() => this._handleProceed()}
          >
            ${t("proceed")}
          </cds-button>
          <qui-loader ?hidden=${!this.isLoading()}></qui-loader>
        </cds-modal-footer>
      </cds-modal>
    `;
  }
}
