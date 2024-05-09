import { html } from "lit";
import { customElement } from "lit/decorators.js";
import { StyledElement } from "../../../shared/styled.element";
import { faGear } from "@fortawesome/free-solid-svg-icons";

@customElement("aside-footer")
export class AsideFooter extends StyledElement() {
  private _handleSettingsClick() {}
  protected render() {
    return html`
      <div class="w-16 bg-white dark:bg-gray-800">
        <cds-icon-button
          label="Settings"
          size="lg"
          kind="ghost"
          @click="${this._handleSettingsClick}"
        >
          <fa-icon .icon=${faGear}></fa-icon>
          <span slot="tooltip-content">Settings</span>
        </cds-icon-button>
      </div>
    `;
  }
}
