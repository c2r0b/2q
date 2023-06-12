import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { StyledElement } from '../../shared/styled.element';

@customElement('qui-select')
export class QuiSelect extends StyledElement() {
  @property ({ type: Boolean }) disabled = false;
  @property ({ type: String }) value = undefined;

  protected render() {
    return html`
      <select
        class="px-2 py-1 w-full bg-gray-200 hover:bg-gray-600 rounded-sm dark:bg-gray-700 dark:border-gray-600"
        ?disabled=${this.disabled}
        .value=${this.value}
      >
        <slot></slot>
      </select>
    `;
  }
}