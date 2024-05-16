import { html } from "lit";
import { customElement } from "lit/decorators.js";
import { StyledElement } from "../../../shared/styled.element";

import "@carbon/web-components/es/components/pagination/index.js";

@customElement("section-footer")
export class SectionFooter extends StyledElement() {
  protected render() {
    return html`
      <div class="w-full flex justify-between bg-white dark:bg-gray-800">
        <cds-pagination page-size="10" size="lg" start="0" total="100">
        </cds-pagination>
      </div>
    `;
  }
}
