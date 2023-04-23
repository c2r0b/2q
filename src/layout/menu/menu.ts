import { ApolloQueryController } from '@apollo-elements/core';
import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { selMovie } from '../../cache.js';

import { faCamera } from '@fortawesome/free-solid-svg-icons';

import "./add.js";
import "./edit.js";
import "./delete.js";

import { MenuQuery } from './queries/Menu.query.graphql.js';

import { sharedStyles } from '../shared.styles';

@customElement('side-menu')
export class Menu extends LitElement {
  static readonly styles = [sharedStyles];

  @property() private canEdit: boolean = false;

  query = new ApolloQueryController(this, MenuQuery);

  // on section change
  private onMenuEntryClick(path) {
    //window.history.pushState({}, '', '/' + path);
    //selMovie(path);
    this.dispatchEvent(new CustomEvent('sectionChange',{
      detail: { message: path }
    }));
  }

  private updateData() {
    this.query.refetch();
  }
  
  protected render() {
    const sections = this.query.data?.sections ?? [];
    return html`
      <dl>
        <ul class="menu bg-base-100 w-56 p-2 rounded-box">
          ${sections.map(s => {
            return html`
              <li @click="${() => this.onMenuEntryClick(s.id)}">
                <a>
                  <fa-icon .icon=${faCamera}></fa-icon>
                  ${s.title}
                  <div ?hidden=${!this.canEdit}>
                  <edit-btn
                    sectionId="${s.id}"
                    @edit="${this.updateData}"
                  ></edit-btn>
                  <delete-btn
                    sectionId="${s.id}"
                    @delete="${this.updateData}"
                  ></delete-btn>
                </a>
              </li>
            `;
          })}
        </ul>
        <add-btn
          ?hidden=${!this.canEdit}
          @add="${this.updateData}"
        ></add-btn>
      </dl>
    `;
  }
}
