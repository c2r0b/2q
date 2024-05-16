import { LitElement, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { listen } from "@tauri-apps/api/event";
import { t } from "src/locales";

import "@carbon/web-components/es/components/icon-button/index.js";

import "../../../modals/add-section/add-section";

@customElement("add-btn")
export class AddButton extends LitElement {
  static readonly styles = [];

  @state() open: boolean = false;

  private async _handleAddClick() {
    this.open = true;

    const unlisten = await listen("section-created", async () => {
      this.dispatchEvent(new CustomEvent("add"));
      unlisten();
    });
  }

  private _handleClose() {
    this.open = false;
  }

  protected render() {
    return html`
      <cds-icon-button
        aria-label=${t("addNewSection")}
        kind="ghost"
        size="lg"
        @click="${this._handleAddClick}"
      >
        <fa-icon .icon=${faPlus}></fa-icon>
        <span slot="tooltip-content">${t("addNewSection")}</span>
      </cds-icon-button>
      <modal-add-section
        ?open=${this.open}
        @closed=${this._handleClose}
      ></modal-add-section>
    `;
  }
}
