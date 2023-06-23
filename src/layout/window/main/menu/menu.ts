import { ApolloQueryController } from '@apollo-elements/core';
import { html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { StyledElement } from '../../../../shared/styled.element';

import { faCamera } from '@fortawesome/free-solid-svg-icons';

import "./header";
import "./footer";

import "./header/add.js";
import "./edit.js";
import "./delete.js";

import { MenuQuery } from './queries/Menu.query.graphql.js';

@customElement('side-menu')
export class Menu extends StyledElement() {
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

  // filter sections by title
   private onFilterChange(e) {
     this.query.variables = {
       title: e.detail.message || undefined
     };
     this.updateData();
  }
  
  protected render() {
    const sections = this.query.data?.sections ?? [];
    return html`
      <aside class="flex-none w-64 h-full relative border-r border-r-gray-200 dark:border-r-gray-700">
        <aside-header
          @refresh="${this.updateData}"
          @filterChange="${this.onFilterChange}"
        ></aside-header>
        <ul class="w-100 list-none">
          ${sections.map(s => {
            return html`
              <li
                class="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
                @click="${() => this.onMenuEntryClick(s.id)}"
              >
                <a>
                  <fa-icon .icon=${faCamera}></fa-icon>
                  ${s.title}
                  <div>
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
        <aside-footer></aside-footer>
      </aside>
    `;
  }
}
