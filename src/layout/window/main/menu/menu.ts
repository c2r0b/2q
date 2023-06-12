import { ApolloQueryController } from '@apollo-elements/core';
import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { StyledElement } from '../../../../shared/styled.element';

import { faCamera } from '@fortawesome/free-solid-svg-icons';

import "./add.js";
import "./edit.js";
import "./delete.js";

import { MenuQuery } from './queries/Menu.query.graphql.js';

@customElement('side-menu')
export class Menu extends StyledElement() {
  @property() private canEdit: boolean = false;

  query = new ApolloQueryController(this, MenuQuery);

  // on section change
  private onMenuEntryClick(path) {
    this.dispatchEvent(new CustomEvent('sectionChange',{
      detail: { message: path }
    }));
  }

  private async updateData() {
    await this.query.refetch();
  }
  
  protected render() {
    const sections = this.query.data?.sections ?? [];
    return html`
      <dl>
        <ul class="w-100 list-none">
          ${sections.map(s => {
            return html`
              <li
                class="p-2 hover:bg-red-200 cursor-pointer"
                @click="${() => this.onMenuEntryClick(s.id)}"
              >
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
                  </div>
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
