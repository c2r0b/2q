import { html } from "lit";
import { customElement } from "lit/decorators.js";
import { StyledElement } from "../../../shared/styled.element";

@customElement("app-footer")
export class AppHeader extends StyledElement() {
  protected render() {
    return html`
      <div
        class="w-full h-7 border-t border-t-gray-200 dark:border-t-gray-700 px-4 pt-1.5 text-xs text-gray-600"
      >
        <slot></slot>
      </div>
    `;
  }
}
