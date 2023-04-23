import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';

import { faUser } from '@fortawesome/free-solid-svg-icons';

import { sharedStyles } from '../shared.styles';
import { auth } from '../../utils/auth';

@customElement('user-button')
export class UserButton extends LitElement {
  static readonly styles = [sharedStyles];

  @state() user? = auth.user;

  private async _handleLogout() {
    await auth.logout();
  }

  protected render() {
    return html`
      <div class="dropdown dropdown-en®d">
        <div class="tooltip-bottom" data-tip="Account">
          <span>${this.user?.name}</span>
          <label tabindex="0" class="btn btn-ghost btn-circle">
            <fa-icon .icon=${faUser}></fa-icon>
          </label>
        </div>
        <ul tabindex="0" class="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
          <li @click="${this._handleLogout}"><a>Logout</a></li>
        </ul>
      </div>
    `;
  }
}