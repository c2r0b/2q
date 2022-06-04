import { ApolloMutationController, ApolloQueryController } from '@apollo-elements/core';
import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { selMovie } from '../../cache.js';
import { v4 as uuid } from 'uuid';

import { MenuQuery } from './queries/Menu.query.graphql.js';
import { CreateSections } from './mutations/CreateSections.mutation.graphql.js';
import { UpdateSections } from './mutations/UpdateSections.mutation.graphql.js';
import { DeleteSections } from './mutations/DeleteSections.mutation.graphql.js';

@customElement('side-menu')
export class Menu extends LitElement {
  @property() private canEdit: boolean = false;

  query = new ApolloQueryController(this, MenuQuery);

  createSectionsMutation = new ApolloMutationController(this, CreateSections)
  updateSectionsMutation = new ApolloMutationController(this, UpdateSections)
  deleteSectionsMutation = new ApolloMutationController(this, DeleteSections)
  
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

  private async _handleAddClick(e) {
    const title = prompt("New section name");
    if (!title) {
      alert("Invalid section name");
      return;
    }
    this.createSectionsMutation.variables = {
      input: [
        {
          id: uuid(),
          title
        }
      ]
    };
    await this.createSectionsMutation.mutate();
    this.updateData();
  }

  private async _handleEditClick(id: string, oldTitle: string) {
    const newTitle = prompt("Enter section name", oldTitle);
    if (!newTitle) {
      alert("Invalid section name");
      return;
    }
    if (newTitle !== oldTitle) {
      this.updateSectionsMutation.variables = {
        where: {
          id
        },
        update: {
          title: newTitle
        }
      };
      await this.updateSectionsMutation.mutate();
      this.updateData();

      //TODO: refresh container if edited is selected
    }
  }

  private async _handleDeleteClick(id) {
    if (confirm("Are you sure you want to delete this?")) {
      this.deleteSectionsMutation.variables = {
        where: {
          id
        }
      };
      await this.deleteSectionsMutation.mutate();
      this.updateData();
    }
  }
  
  render() {
    const sections = this.query.data?.sections ?? [];
    return html`
      <dl>
        <ul>
          ${sections.map(s => {
            return html`
              <li @click="${() => this.onMenuEntryClick(s.id)}">
                ${s.title}
                <button
                  type="button"
                  ?hidden=${!this.canEdit}
                  @click="${() => this._handleEditClick(s.id, s.title)}"
                >
                  Edit
                </button>
                <button
                  type="button"
                  ?hidden=${!this.canEdit}
                  @click="${() => this._handleDeleteClick(s.id)}"
                >
                  Delete
                </button>
              </li>
            `;
          })}
        </ul>
        <button
          type="button"
          ?hidden=${!this.canEdit}
          @click="${this._handleAddClick}"
        >
          Add
        </button>
      </dl>
    `;
  }
}
