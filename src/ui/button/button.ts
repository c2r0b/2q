import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import {classMap} from 'lit/directives/class-map.js';
import { StyledElement } from '../../shared/styled.element';

@customElement('qui-button')
export class QuiButton extends StyledElement() {
  @property ({ type: Function }) onClick = () => {};
  @property ({ type: String }) icon = undefined;
  @property ({ type: Boolean }) disabled = false;
  @property ({ type: String }) appearance = undefined;

  protected render() {
    const classes = {
      'transition-all duration-150 px-3 py-1 cursor-pointer rounded-sm hover:bg-gray-300 dark:hover:text-gray-900 dark:bg-gray-700 dark:border-gray-600 disabled:bg-gray-50 dark:disabled:bg-gray-950 disabled:cursor-not-allowed disabled:text-gray-400 disabled:dark:text-gray-600': true,
      'bg-gray-200': this.appearance !== 'primary',
      'bg-blue-500 hover:bg-blue-600 text-white': this.appearance === 'primary',
    };

    return html`
      <button
        class=${classMap(classes)}
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