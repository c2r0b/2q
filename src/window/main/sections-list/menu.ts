import { ApolloQueryController } from "@apollo-elements/core";
import { html } from "lit";
import { customElement } from "lit/decorators.js";
import { StyledElement } from "../../../shared/styled.element";

import { faCamera } from "@fortawesome/free-solid-svg-icons";

import "./footer";

import "./footer/add";
import "./edit";
import "./delete";

import { MenuQuery } from "./queries/Menu.query.graphql";

@customElement("sections-list-menu")
export class Menu extends StyledElement() {
  query = new ApolloQueryController(this, MenuQuery, {
    onError: this.handleError,
  });

  // on section change
  private onMenuEntryClick(path) {
    this.dispatchEvent(
      new CustomEvent("sectionChange", {
        detail: { message: path },
      })
    );
  }

  private handleError(error) {
    alert("Failed to load context sections: " + error.message);
  }

  private async updateData() {
    try {
      await this.query.refetch();
    } catch (error) {
      this.handleError(error);
    }
  }

  // filter sections by title
  private onFilterChange(e) {
    this.query.variables = {
      title: e.detail.message || undefined,
    };
    this.updateData();
  }

  protected render() {
    const sections = this.query.data?.sections ?? [];
    return html`
      <aside
        class="flex flex-col h-full justify-between w-64 relative border-r border-r-gray-200 dark:border-r-gray-700"
      >
        <ul class="w-100 list-none">
          ${sections.map((s) => {
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
        <sections-list-footer
          @refresh="${this.updateData}"
          @filterChange="${this.onFilterChange}"
        ></sections-list-footer>
      </aside>
    `;
  }
}
