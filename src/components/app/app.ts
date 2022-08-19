import { LitElement, html } from 'lit';
import { ApolloQueryController } from '@apollo-elements/core';
import { customElement, state } from 'lit/decorators.js';

import { AppQuery } from './App.query.graphql';

import "../header";
import "../menu";
import "../list";

import style from './app.css';
import shared from '../shared.css';
import createAuth0Client from '@auth0/auth0-spa-js';

@customElement('gemo-app')
export class ApolloApp extends LitElement {
  static readonly styles = [shared, style];
  private _auth = undefined;

  query = new ApolloQueryController(this, AppQuery);

  @state() private sectionId: String = "";
  @state() private canEdit: boolean = false;
  @state() private isAuthenticated: boolean = false;

  async connectedCallback() {
    super.connectedCallback();
    await this.buildauth();
    await this.handleRedirectCallback();
    
    // force user auth
    const isAuthenticated = await this._auth.isAuthenticated();
    if (!isAuthenticated) {
      await this._auth.loginWithRedirect({
        redirect_uri: window.location.origin
      });
    }
    localStorage.setItem("token", await this._auth.getTokenSilently());
    this.isAuthenticated = true;
  }

  private async buildauth() {
    this._auth = await createAuth0Client({
      domain: process.env.AUTH0_DOMAIN,
      client_id: process.env.AUTH0_CLIENT_ID
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
      return html``;
    }
    
    return html`
      <dl><aside>

      <h1 class="text-3xl font-bold underline">
      Hello world!
    </h1>
      <dt>Pathname</dt>
      <dd>${this.query.data?.location?.pathname ?? '/'}</dd>
      <side-menu
        .canEdit=${this.canEdit}
        @sectionChange="${this._handleSectionChange}"
      ></side-menu>
    </aside><h1 class="mx-auto my-4 py-4 text-center shadow-lg text-xl w-1/2">Hello, World!</h1>
        <top-header
          @editToggle="${this._handleEditToggle}"
        ></top-header>
        
        <container>
          <entries-list
            sectionId="${this.sectionId}"
          ></entries-list>
        </container>
      </dl>
    `;
  }
}
