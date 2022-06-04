import { LitElement, html } from 'lit';
import { state } from 'lit-element';
import { ApolloQueryController } from '@apollo-elements/core';
import { customElement } from 'lit/decorators.js';

import { AppQuery } from './App.query.graphql';

import "../side-menu";
import "../entries-list";

import style from './app.css';
import shared from '../shared.css';

@customElement('gemo-app')
export class ApolloApp extends LitElement {
  static readonly is = 'gemo-app';

  static readonly styles = [shared, style];

  query = new ApolloQueryController(this, AppQuery);

  @state()
  private section: string = "";

  _handleSectionChange(e) {
    this.section = e.detail.message;
  }

  render() {
    return html`
      <dl>
        <aside>
          <dt>Pathname</dt>
          <dd>${this.query.data?.location?.pathname ?? '/'}</dd>
          <side-menu @sectionChange="${this._handleSectionChange}"></side-menu>
        </aside>
        <entries-list section="${this.section}"></entries-list>
      </dl>
    `;
  }
}
