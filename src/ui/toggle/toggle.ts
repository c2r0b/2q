import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { StyledElement } from '../../shared/styled.element';

@customElement('qui-toggle')
export class QuiToggle extends StyledElement() {
  @property ({ type: String }) label = "Toggle";
  @property ({ type: Function }) onClick = () => {};

  protected render() {
    return html`
      <label class="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" value="" class="sr-only peer" @change="${this.onClick}">
        <div class="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 dark:peer-focus:ring-gray-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-gray-600"></div>
        <span class="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">${this.label}</span>
      </label>
    `;
  }
}