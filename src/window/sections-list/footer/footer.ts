import { html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { StyledElement } from "../../../shared/styled.element";

import { faSync } from "@fortawesome/free-solid-svg-icons";

import "@carbon/web-components/es/components/search/index.js";
import "@carbon/web-components/es/components/icon-button/index.js";

@customElement("sections-list-footer")
export class SectionsListFooter extends StyledElement() {
  @state() private sectionTitle: string = "";

  private _handleFilterInput(e) {
    this.sectionTitle = (e.detail.value as string) || "";
    this.dispatchEvent(
      new CustomEvent("filterChange", {
        detail: { message: this.sectionTitle },
      })
    );
  }

  private _handleRefresh() {
    this.dispatchEvent(new CustomEvent("refresh"));
  }

  protected render() {
    return html`
      <div class="flex bg-white dark:bg-gray-800">
        <cds-search
          label-text="Search"
          type="text"
          size="lg"
          placeholder="Filter sections"
          value=${this.sectionTitle}
          @cds-search-input=${this._handleFilterInput}
        ></cds-search>

        <cds-icon-button
          aria-label="Refresh sections"
          action="flat-inline"
          size="lg"
          kind="ghost"
          @click=${this._handleRefresh}
        >
          <fa-icon .icon=${faSync}></fa-icon>
          <span slot="tooltip-content">Refresh</span>
        </cds-icon-button>

        <add-btn @add="${this._handleRefresh}"></add-btn>
      </div>
    `;
  }
}
