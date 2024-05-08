import { html } from "lit";
import { customElement } from "lit/decorators.js";
import { StyledElement } from "../../../shared/styled.element";

import { asideStyles } from "./aside.styles";

import "./footer";
import "@carbon/web-components/es/components/icon-button/index.js";
import "@carbon/web-components/es/components/tooltip/index.js";

@customElement("app-aside")
export class AppAside extends StyledElement(asideStyles) {

  protected render() {
    return html`
      <div
        class="w-16 flex flex-col justify-between h-full border-r border-r-gray-200 dark:border-r-gray-700 "
      >
        <div
          class="normal-case text-xl rotate-90 inline-block whitespace-nowrap pl-4 py-3 word-spacing cursor-default"
        >
          My First Context
        </div>
        <aside-footer>
          
        </aside-footer>
      </div>
    `;
  }
}
