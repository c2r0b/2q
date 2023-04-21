import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';

import { createAuth0Client } from '@auth0/auth0-spa-js';
import { UserData } from 'auth0';

import { faUser } from '@fortawesome/free-solid-svg-icons';

import { sharedStyles } from '../shared.styles';

@customElement('user-button')
export class UserButton extends LitElement {
  static readonly styles = [sharedStyles];

  @state() user?: UserData;

  private _auth = undefined;

  async connectedCallback() {
    super.connectedCallback();
    await this.buildauth();
    
    // show information
    this.user = await this._auth.getUser();
  }

  async buildauth() {
    this._auth = await createAuth0Client({
      domain: process.env.AUTH0_DOMAIN,
      clientId: process.env.AUTH0_CLIENT_ID,
      cacheLocation: "localstorage"
    });
  }

  private async _handleLogout() {
    await this._auth.logout({
      returnTo: window.location.origin
    });
    localStorage.removeItem('token');
  }

  render() {
    return html`
      <div class="dropdown dropdown-en®d">
        <div class="tooltip-bottom" data-tip="Account">
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