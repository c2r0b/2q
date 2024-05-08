import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { Window } from "@tauri-apps/api/window";
import { Webview } from "@tauri-apps/api/webview";
import { listen } from "@tauri-apps/api/event";

import "@carbon/web-components/es/components/icon-button/index.js";

import { windowOptions as SectionWindowOptions } from "../../../add-section/add-section";

@customElement("add-btn")
export class AddButton extends LitElement {
  static readonly styles = [];

  private async _handleAddClick() {
    const addSectionModalWindow = new Window(
      "addNewSection",
      SectionWindowOptions
    );
    const webview = new Webview(
      addSectionModalWindow,
      "addNewSectionView",
      SectionWindowOptions
    );
    webview.once("tauri://created", async () => {
      // listen for section creation
      const unlisten = await listen("section-created", async () => {
        this.dispatchEvent(new CustomEvent("add"));
        unlisten();
      });
    });
  }

  protected render() {
    return html`
      <cds-icon-button
        aria-label="Add new section"
        kind="ghost"
        size="lg"
        @click="${this._handleAddClick}"
      >
        <fa-icon .icon=${faPlus}></fa-icon>
        <span slot="tooltip-content">Add new section</span>
      </cds-icon-button>
    `;
  }
}
