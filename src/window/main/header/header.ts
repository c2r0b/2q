import { html } from "lit";
import { customElement } from "lit/decorators.js";
import { StyledElement } from "../../../shared/styled.element";
import { faEllipsis, faGear } from "@fortawesome/free-solid-svg-icons";

import { headerStyles } from "./header.styles";

import "../footer";
import "@carbon/web-components/es/components/button/index.js";
import "@carbon/web-components/es/components/tooltip/index.js";

declare const process: {
  env: {
    PACKAGE_VERSION: string;
  };
};

@customElement("app-header")
export class AppHeader extends StyledElement(headerStyles) {
  private _handleContextClick() {
    return;
  }

  private _handleSessionClick() {}

  private _handleSettingsClick() {}

  protected render() {
    return html`
      <div
        class="w-16 flex flex-col justify-between h-full border-r border-r-gray-200 dark:border-r-gray-700 "
      >
        <div
          class="normal-case text-xl rotate-90 inline-block whitespace-nowrap pl-4 py-3 word-spacing cursor-default"
        >
          My First Context
        </div>
        <div>
          <div class="flex flex-col gap-2 px-4 py-3">
            <cds-tooltip align="right">
              <cds-button
                aria-label="Change selected context"
                disabled
                @click="${this._handleContextClick}"
              >
                <fa-icon .icon=${faEllipsis}></fa-icon>
              </cds-button>
              <cds-tooltip-content>
                <span>Context</span>
              </cds-tooltip-content>
            </cds-tooltip>
            <cds-tooltip align="right">
              <cds-button
                aria-label="Settings"
                @click="${this._handleSettingsClick}"
              >
                <fa-icon .icon=${faGear}></fa-icon>
              </cds-button>
              <cds-tooltip-content>
                <span>Settings</span>
              </cds-tooltip-content>
            </cds-tooltip>
          </div>
          <app-footer>
            <span>v${process.env.PACKAGE_VERSION}</span>
          </app-footer>
        </div>
      </div>
    `;
  }
}
