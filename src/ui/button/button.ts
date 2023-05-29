import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { StyledElement } from '../../shared/styled.element';

@customElement('qui-button')
export class QuiButton extends StyledElement() {
  @property ({ type: String }) label = "Toggle";
  @property ({ type: Function }) onClick = () => {};
  @property ({ type: String }) icon = undefined;

  protected render() {
    return html`
      <button
        class="p-2 bg-gray-200 hover:bg-blue-600 rounded-full dark:bg-gray-700 dark:border-gray-600"
        @click=${this.onClick}
      >
        <fa-icon .icon=${this.icon}></fa-icon>
      </button>
    `;
  }
}