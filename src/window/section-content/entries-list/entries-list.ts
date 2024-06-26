import { ApolloQueryController } from "@apollo-elements/core";
import { LitElement, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { faGear } from "@fortawesome/free-solid-svg-icons";

import { SectionQuery } from "./queries/Section.query.graphql";
import { ColumnsQuery } from "./queries/Columns.query.graphql";

import "@carbon/web-components/es/components/data-table/index.js";

@customElement("entries-list")
export class List extends LitElement {
  @property({}) set sectionId(id: string) {
    this._sectionId = id;
    this.updateData();
  }
  @state() _sectionId: string = "";

  sectionQuery = new ApolloQueryController(this, SectionQuery, {
    variables: this.getSectionQueryParams(),
  });

  columnsQuery = new ApolloQueryController(this, ColumnsQuery, {
    variables: this.getColumnsQueryParams(),
  });

  private getSectionQueryParams() {
    return {
      where: {
        id: this._sectionId,
      },
    };
  }

  private getColumnsQueryParams() {
    return {
      where: {
        sectionId: this._sectionId,
      },
    };
  }

  private updateData() {
    this.sectionQuery.refetch(this.getSectionQueryParams());
    this.columnsQuery.refetch(this.getColumnsQueryParams());
  }

  protected render() {
    const section = this.sectionQuery?.data?.sections[0];
    const columns = this.columnsQuery?.data?.columns;

    return html`
      <cds-table is-sortable>
        <cds-table-header-title slot="title"
          >${section?.title}</cds-table-header-title
        >
        <cds-table-header-description slot="description"
          >${this._sectionId}</cds-table-header-description
        >

        <cds-table-toolbar slot="toolbar">
          <cds-table-toolbar-content ?has-batch-actions="true">
            <cds-table-toolbar-search
              placeholder="Filter table"
            ></cds-table-toolbar-search>
            <cds-overflow-menu toolbar-action>
              <fa-icon slot="cds-overflow-button" icon=${faGear}></fa-icon>
              <cds-overflow-menu-body>
                <cds-overflow-menu-item> Action 1 </cds-overflow-menu-item>
                <cds-overflow-menu-item> Action 2 </cds-overflow-menu-item>
                <cds-overflow-menu-item> Action 3 </cds-overflow-menu-item>
              </cds-overflow-menu-body>
            </cds-overflow-menu>
            <cds-button>Primary Button</cds-button>
          </cds-table-toolbar-content>
        </cds-table-toolbar>

        <cds-table-head>
          <cds-table-header-row>
          ${columns.map((s) => {
            return html`
              <cds-table-header>${s.title}</cds-table-header>
            `;
          })}
          </cds-table-header-row>
        </cds-table-head>
        <cds-table-body>
          <cds-table-row>
            <cds-table-cell>Load Balancer 3</cds-table-cell>
            <cds-table-cell>HTTP</cds-table-cell>
            <cds-table-cell>3000</cds-table-cell>
            <cds-table-cell>Round robin</cds-table-cell>
            <cds-table-cell>Kevin's VM Groups</cds-table-cell>
            <cds-table-cell
              ><cds-link disabled>Disabled</cds-link></cds-table-cell
            >
          </cds-table-row>
          <cds-table-row>
            <cds-table-cell>Load Balancer 1</cds-table-cell>
            <cds-table-cell>HTTP</cds-table-cell>
            <cds-table-cell>443</cds-table-cell>
            <cds-table-cell>Round robin</cds-table-cell>
            <cds-table-cell>Maureen's VM Groups</cds-table-cell>
            <cds-table-cell><cds-link>Starting</cds-link></cds-table-cell>
          </cds-table-row>
          <cds-table-row>
            <cds-table-cell>Load Balancer 2</cds-table-cell>
            <cds-table-cell>HTTP</cds-table-cell>
            <cds-table-cell>80</cds-table-cell>
            <cds-table-cell>DNS delegation</cds-table-cell>
            <cds-table-cell>Andrew's VM Groups</cds-table-cell>
            <cds-table-cell><cds-link>Active</cds-link></cds-table-cell>
          </cds-table-row>
          <cds-table-row>
            <cds-table-cell>Load Balancer 6</cds-table-cell>
            <cds-table-cell>HTTP</cds-table-cell>
            <cds-table-cell>3000</cds-table-cell>
            <cds-table-cell>Round robin</cds-table-cell>
            <cds-table-cell>Marc's VM Groups</cds-table-cell>
            <cds-table-cell
              ><cds-link disabled>Disabled</cds-link></cds-table-cell
            >
          </cds-table-row>
          <cds-table-row>
            <cds-table-cell>Load Balancer 4</cds-table-cell>
            <cds-table-cell>HTTP</cds-table-cell>
            <cds-table-cell>443</cds-table-cell>
            <cds-table-cell>Round robin</cds-table-cell>
            <cds-table-cell>Mel's VM Groups</cds-table-cell>
            <cds-table-cell><cds-link>Starting</cds-link></cds-table-cell>
          </cds-table-row>
          <cds-table-row>
            <cds-table-cell>Load Balancer 5</cds-table-cell>
            <cds-table-cell>HTTP</cds-table-cell>
            <cds-table-cell>80</cds-table-cell>
            <cds-table-cell>DNS delegation</cds-table-cell>
            <cds-table-cell>Ronja's VM Groups</cds-table-cell>
            <cds-table-cell><cds-link>Active</cds-link></cds-table-cell>
          </cds-table-row>
        </cds-table-body>
      </cds-table>
    `;
  }
}
