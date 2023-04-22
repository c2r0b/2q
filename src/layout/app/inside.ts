import { LitElement, html } from 'lit';
import { ApolloQueryController } from '@apollo-elements/core';
import { customElement, state } from 'lit/decorators.js';

import { AppQuery } from './App.query.graphql';

import "../header";
import "../menu";
import "../list";

import { appStyles } from './app.styles';
import { sharedStyles } from '../shared.styles';

@customElement('inside-app')
export class InsideApp extends LitElement {
  static readonly styles = [sharedStyles, appStyles];

  query = new ApolloQueryController(this, AppQuery);

  @state() private sectionId: string = "";
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
