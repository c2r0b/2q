import { html } from 'lit';
import { ApolloQueryController } from '@apollo-elements/core';
import { customElement, state } from 'lit/decorators.js';
import { StyledElement } from '../../shared/styled.element';

import { AppQuery } from './App.query.graphql';

import "../header";
import "../footer";
import "../menu";
import "../list";

import { appStyles } from './app.styles';

@customElement('main-app')
export class ApolloApp extends StyledElement() {
  static readonly styles = [appStyles];

  query = new ApolloQueryController(this, AppQuery);

  @state() private sectionId: string = "";
  @state() private canEdit: boolean = false;

  private _handleSectionChange(e) {
    this.sectionId = e.detail.message;
  }

  private _handleEditToggle(e) {
    this.canEdit = e.detail.message;
  }

  protected render() {
    return html`
      <div class="flex flex-row">
        <aside class="w-100">
          <aside-header
            @editToggle="${this._handleEditToggle}"
          ></aside-header>
          <side-menu
            .canEdit=${this.canEdit}
            @sectionChange="${this._handleSectionChange}"
          ></side-menu>
          <aside-footer
            @editToggle="${this._handleEditToggle}"
          ></aside-footer>
        </aside>
        
        <container>
          <dt>Pathname</dt>
          <dd>${this.query.data?.location?.pathname ?? '/'}</dd>
          <entries-list
            sectionId="${this.sectionId}"
          ></entries-list>
        </container>
      </div>
    `;
  }
}