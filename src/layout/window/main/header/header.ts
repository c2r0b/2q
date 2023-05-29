import { html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { StyledElement } from '../../../../shared/styled.element';

import '../footer/editToggle';

@customElement('aside-header')
export class AsideHeader extends StyledElement() {
  protected render() {
    return html`
      <div class="flex justify-between px-5 bg-gray-100 dark:bg-gray-800 py-3">
        <span class="text-l normal-case pt-2">My First App</span>
      </div>
    `;
  }
}