import { html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { StyledElement } from '../../shared/styled.element';

@customElement('qui-tooltip')
export class QuiTooltip extends StyledElement() {
  @property({ type: String }) text = '';
  @property({ type: String }) orientation = 'above';
  @property({ type: Boolean }) arrow = true;
  @state() private showTooltip = false;

  tooltipClass = {
    above: 'bottom-full left-1/2 mb-4 transform translate-y-[10px] -translate-x-1/2',
    below: 'top-full left-1/2 mt-4 transform -translate-y-[10px] -translate-x-1/2',
    left: 'right-full top-1/2 mr-4 transform translate-x-[10px] -translate-y-1/2',
    right: 'left-full top-1/2 ml-4 transform -translate-x-[10px] -translate-y-1/2',
  }

  render() {
    if (!this.text) return html`<slot></slot>`;

    return html`
      <div
        class="relative inline-block"
        @mouseenter="${() => this.showTooltip = true}"
        @mouseleave="${() => this.showTooltip = false}"
        @click="${() => this.showTooltip = false}"
      >
        <slot></slot>
        <span 
          class="tooltip-text absolute text-center rounded-md p-1 bg-white dark:bg-black transition-opacity z-10 ${this.tooltipClass[this.orientation]} w-24 ${this.showTooltip ? 'opacity-100' : 'opacity-0'}"
        >
          ${this.text}
        </span>
      </div>
    `;
  }
}
