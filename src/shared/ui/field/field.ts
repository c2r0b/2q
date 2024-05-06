import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { StyledElement } from "../../styled.element";

@customElement("qui-field")
export class QuiField extends StyledElement() {
  @property({ type: String }) label = undefined;

  protected render() {
    return html`
      <div class="flex flex-col">
        <label class="mb-1 text-sm font-bold text-gray-700 dark:text-gray-200">
          ${this.label}
        </label>
        <slot></slot>
      </div>
    `;
  }
}
