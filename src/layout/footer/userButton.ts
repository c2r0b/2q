import { html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { StyledElement } from '../../shared/styled.element';

import { faUser } from '@fortawesome/free-solid-svg-icons';

import { auth } from '../../utils/auth';

@customElement('user-button')
export class UserButton extends StyledElement() {
  @state() user? = auth.user;

  private async _handleLogout() {
    await auth.logout();
  }

  protected render() {
    return html`
      <button id="dropdownUserButton" data-dropdown-toggle="dropdown" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button">
        <span>${this.user?.name}</span>
        <label tabindex="0" class="ml-2">
          <fa-icon .icon=${faUser}></fa-icon>
        </label>
      </button>
      <div id="dropdown" class="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700">
        <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownUserButton">
          <li @click="${this._handleLogout}"><a>Logout</a></li>
        </ul>
      </div>
    `;
  }
}