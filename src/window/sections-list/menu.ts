import { ApolloQueryController } from "@apollo-elements/core";
import { html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { StyledElement } from "../../shared/styled.element";

import { faCamera } from "@fortawesome/free-solid-svg-icons";

import "./footer";

import "./footer/add";
import "../section-content/delete";

import "@carbon/web-components/es/components/ui-shell/side-nav-items.js";
import "@carbon/web-components/es/components/ui-shell/side-nav-menu-item.js";

import { MenuQuery } from "./queries/Menu.query.graphql";

@customElement("sections-list-menu")
export class Menu extends StyledElement() {
  @state() selectedSectionId = "";

  query = new ApolloQueryController(this, MenuQuery, {
    onError: this.handleError,
  });

  // on section change
  private onMenuEntryClick(sectionId) {
    this.selectedSectionId = sectionId;
    this.dispatchEvent(
      new CustomEvent("sectionChange", {
        detail: { message: sectionId },
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
        class="flex flex-col h-full justify-between w-80 relative border-r border-r-gray-200 dark:border-r-gray-700"
      >
        <cds-side-nav-items>
          ${sections.map((s) => {
            return html`
              <cds-side-nav-menu-item
                ?active=${this.selectedSectionId === s.id}
                @click="${() => this.onMenuEntryClick(s.id)}"
              >
                <fa-icon .icon=${faCamera}></fa-icon>
                ${s.title}
              </cds-side-nav-menu-item>
            `;
          })}
        </cds-side-nav-items>
        <sections-list-footer
          @refresh="${this.updateData}"
          @filterChange="${this.onFilterChange}"
        ></sections-list-footer>
      </aside>
    `;
  }
}
