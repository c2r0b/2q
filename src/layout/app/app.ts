import { LitElement, html } from 'lit';
import { ApolloQueryController } from '@apollo-elements/core';
import { customElement, state } from 'lit/decorators.js';

import { createAuth0Client } from '@auth0/auth0-spa-js';

import { AppQuery } from './App.query.graphql';

import "../header";
import "../menu";
import "../list";

import { appStyles } from './app.styles';
import { sharedStyles } from '../shared.styles';

@customElement('main-app')
export class ApolloApp extends LitElement {
  static readonly styles = [sharedStyles, appStyles];
  private _auth = undefined;

  query = new ApolloQueryController(this, AppQuery);

  @state() private sectionId: string = "";
  @state() private canEdit: boolean = false;
  @state() private isAuthenticated: boolean = false;

  async connectedCallback() {
    super.connectedCallback();
    await this.buildauth();
    await this.handleRedirectCallback();
    
    // force user auth
    const isAuthenticated = await this._auth.isAuthenticated();
    if (!isAuthenticated) {
      await this._auth.loginWithRedirect();
    }
    localStorage.setItem('token', await this._auth.getTokenSilently());
    this.isAuthenticated = true;
  }

  private async buildauth() {
    this._auth = await createAuth0Client({
      domain: process.env.AUTH0_DOMAIN,
      clientId: process.env.AUTH0_CLIENT_ID,
      cacheLocation: 'localstorage',
      authorizationParams: {
        audience: process.env.AUTH0_AUDIENCE,
        redirect_uri: window.location.origin
      }
    });
  }

  private async handleRedirectCallback() {
    const isAuthenticated = await this._auth.isAuthenticated();

    if (!isAuthenticated) {
      const query = window.location.search;
      if (query.includes("code=") && query.includes("state=")) {
        await this._auth.handleRedirectCallback();
        window.history.replaceState({}, document.title, "/");
      }
    }
  }
  
  private _handleSectionChange(e) {
    this.sectionId = e.detail.message;
  }

  private _handleEditToggle(e) {
    this.canEdit = e.detail.message;
  }

  render() {
    if (!this.isAuthenticated) {
      return html`<p>Authenticating...</p>`;
    }

    return html`
      <dl>
        <top-header
          @editToggle="${this._handleEditToggle}"
        ></top-header>
        <aside>
          <side-menu
            .canEdit=${this.canEdit}
            @sectionChange="${this._handleSectionChange}"
          ></side-menu>
        </aside>
        
        <container>
          <dt>Pathname</dt>
          <dd>${this.query.data?.location?.pathname ?? '/'}</dd>
          <entries-list
            sectionId="${this.sectionId}"
          ></entries-list>
        </container>
      </dl>
    `;
  }
}
