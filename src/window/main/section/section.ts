import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { StyledElement } from "../../../shared/styled.element";

import "./list";
import "./footer";

@customElement("section-content")
export class SectionContent extends StyledElement() {
  @property({}) set sectionId(id: String) {
    this._sectionId = id;
  }
  private _sectionId: String = "";

  protected render() {
    return html`
      <div class="flex flex-col h-full justify-between">
        <container class="flex-none w-2/3 p-5">
          <dt>Pathname</dt>
          <entries-list sectionId="${this._sectionId}"></entries-list>
        </container>
        <section-footer></section-footer>
      </div>
    `;
  }
}
