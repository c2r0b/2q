import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { StyledElement } from '../../shared/styled.element';

@customElement('qui-button')
export class QuiButton extends StyledElement() {
  @property ({ type: Function }) onClick = () => {};
  @property ({ type: String }) icon = undefined;
  @property ({ type: Boolean }) disabled = false;

  protected render() {
    return html`
      <button
        class="transition-all duration-150 px-3 py-1 cursor-pointer bg-gray-200 rounded-sm hover:bg-gray-300 dark:hover:text-gray-900 dark:bg-gray-700 dark:border-gray-600 disabled:bg-gray-50 dark:disabled:bg-gray-950 disabled:cursor-not-allowed disabled:text-gray-400 disabled:dark:text-gray-600"
        ?disabled=${this.disabled}
        @click=${this.onClick}
      >
        <fa-icon
          ?hidden=${!this.icon}
          .icon=${this.icon}
        ></fa-icon>
        <slot></slot>
      </button>
    `;
  }
}