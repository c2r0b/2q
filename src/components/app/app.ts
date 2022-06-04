import { LitElement, html } from 'lit';
import { ApolloQueryController } from '@apollo-elements/core';
import { customElement, state } from 'lit/decorators.js';

import { AppQuery } from './App.query.graphql';

import "../header";
import "../menu";
import "../list";

import style from './app.css';
import shared from '../shared.css';

@customElement('gemo-app')
export class ApolloApp extends LitElement {
  static readonly styles = [shared, style];

  query = new ApolloQueryController(this, AppQuery);

  @state() private sectionId: String = "";
  @state() private canEdit: boolean = false;

  private _handleSectionChange(e) {
    this.sectionId = e.detail.message;
  }

  private _handleEditToggle(e) {
    this.canEdit = e.detail.message;
  }

  render() {
    return html`
      <dl>
        <top-header
          @editToggle="${this._handleEditToggle}"
        ></top-header>
        <aside>
          <dt>Pathname</dt>
          <dd>${this.query.data?.location?.pathname ?? '/'}</dd>
          <side-menu
            .canEdit=${this.canEdit}
            @sectionChange="${this._handleSectionChange}"
          ></side-menu>
        </aside>
        <container>
          <entries-list
            sectionId="${this.sectionId}"
          ></entries-list>
        </container>
      </dl>
    `;
  }
}
