import { ApolloQueryController } from "@apollo-elements/core";
import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { StyledElement } from "../../shared/styled.element";

import "./entries-list";
import "./footer";

@customElement("section-content")
export class SectionContent extends StyledElement() {
  @property({}) sectionId: string = "";

  protected render() {
    return html`
      <div class="flex flex-col h-full justify-between">
        <container class="flex-none w-2/3 p-5">
          <entries-list sectionId="${this.sectionId}"></entries-list>
        </container>
        <section-footer></section-footer>
      </div>
    `;
  }
}
