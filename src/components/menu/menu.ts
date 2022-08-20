import { ApolloQueryController } from '@apollo-elements/core';
import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { selMovie } from '../../cache.js';

import { faCamera } from '@fortawesome/free-solid-svg-icons';

import "./add.ts";
import "./edit.ts";
import "./delete.ts";

import { MenuQuery } from './queries/Menu.query.graphql.js';

@customElement('side-menu')
export class Menu extends LitElement {
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
  
  render() {
    const sections = this.query.data?.sections ?? [];
    return html`
      <dl>
        <ul>
          ${sections.map(s => {
            return html`
              <li @click="${() => this.onMenuEntryClick(s.id)}">
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
