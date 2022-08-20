import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';

import createAuth0Client from '@auth0/auth0-spa-js';
import { UserData } from 'auth0';

@customElement('user-button')
export class UserButton extends LitElement {
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
      client_id: process.env.AUTH0_CLIENT_ID,
      audience: process.env.AUTH0_AUDIENCE,
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
      <p>${this.user?.name}</p>
      <button 
        type="button"
        @click="${this._handleLogout}"
      >
        Log out
      </button>
    `;
  }
}