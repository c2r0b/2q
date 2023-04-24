import { html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { StyledElement } from '../../shared/styled.element';

import './userButton';

@customElement('aside-footer')
export class AsideFooter extends StyledElement() {
  protected render() {
    return html`
      <div class="flex justify-between px-5 bg-gray-100 dark:bg-gray-800 py-3">
        <div class="flex gap-5">
          <user-button></user-button>
        </div>
      </div>
    `;
  }
}