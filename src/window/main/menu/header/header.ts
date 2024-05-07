import { html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { StyledElement } from "../../../../shared/styled.element";

import { faSync } from "@fortawesome/free-solid-svg-icons";

import "@carbon/web-components/es/components/search/index.js";
import "@carbon/web-components/es/components/tooltip/index.js";
import "@carbon/web-components/es/components/button/index.js";

@customElement("aside-header")
export class AsideHeader extends StyledElement() {
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
      <div class="flex gap-2 px-3 py-2">
        <cds-search
          label-text="Search"
          size="sm"
          type="text"
          placeholder="Filter sections"
          value=${this.sectionTitle}
          @cds-search-input=${this._handleFilterInput}
        ></cds-search>

        <cds-tooltip align="bottom">
          <cds-button
            aria-label="Refresh sections"
            action="flat-inline"
            size="sm"
            hasIconOnly
            kind="secondary"
            tooltip="Refresh"
            @click=${this._handleRefresh}
          >
            <fa-icon .icon=${faSync}></fa-icon>
          </cds-button>
          <cds-tooltip-content>
            <span>Refresh</span>
          </cds-tooltip-content>
        </cds-tooltip>

        <add-btn @add="${this._handleRefresh}"></add-btn>
      </div>
    `;
  }
}
