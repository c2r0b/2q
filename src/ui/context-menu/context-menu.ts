/*

TEMPORARY FIX FOR CONTEXT MENU
This should be replaced with a native context menu when it's available
https://github.com/tauri-apps/tauri/issues/4338
  
*/

import { html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { StyledElement } from '../../shared/styled.element';

interface Option {
  type: 'option' | 'divider';
  label?: string;
  icon?: string;
  disabled?: boolean;
  action?: () => void;
}

@customElement('qui-context-menu')
export class QuiContextMenu extends StyledElement() {
  @property({ type: Array<Option> }) options = [];
  @property({ type: String }) trigger = 'click'; // 'click', 'contextmenu' or 'both'
  @state() private showMenu = false;
  @state() private x = 0;
  @state() private y = 0;

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('click', () => this.showMenu = false);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('click', () => this.showMenu = false);
  }

  openMenu(e) {
    e.preventDefault();
    e.stopPropagation();

    if (
      (this.trigger === 'click' && e.type !== 'click') ||
      (this.trigger === 'contextmenu' && e.type !== 'contextmenu')
    ) {
      return;
    }

    this.x = e.clientX;
    this.y = e.clientY;
    this.showMenu = true;
  }

  handleAction(action) {
    action();
    this.showMenu = false;
  }

  private renderOption(option: Option) {
    if (option.type === 'divider') {
      return html`<div class="my-1 border-t border-gray-200 dark:border-gray-800"></div>`;
    }
    return html`
      <button
        class="w-full rounded px-3 py-2 text-left cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
        @click="${() => this.handleAction(option.action)}"
        ?disabled=${option.disabled}
      >
        <fa-icon
          class="mr-1"
          ?hidden=${!option.icon}
          .icon=${option.icon}
        ></fa-icon>
        ${option.label}
      </button>
    `;
  }

  render() {
    return html`
      <div @click="${this.openMenu}" @contextmenu="${this.openMenu}">
        <slot></slot>
      </div>

      <div class="absolute z-20 bg-white dark:bg-black rounded shadow-md ${this.showMenu ? 'block' : 'hidden'}" style="top: ${this.y}px; left: ${this.x}px">
        ${this.options.map(option => this.renderOption(option))}
      </div>
    `;
  }
}
