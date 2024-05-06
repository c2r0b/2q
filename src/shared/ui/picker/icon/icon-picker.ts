import { html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { StyledElement } from "../../../styled.element";
import "@fortawesome/fa-icon-chooser";

import FaPickerLogic from "./logic";

@customElement("qui-icon-picker")
export class QuiIconPicker extends StyledElement() {
  @state() private picker: any = null;

  handleIconQuery(query) {
    // some function that handles queries
    console.log(query);
  }

  getIconUrlText(url) {
    // some function that handles GET requests
    console.log(url);
  }

  handleIconResult(event) {
    const result = event && event.detail;
    console.log(result);

    if (result) {
      console.log(`<i class"${result.prefix} ${result.iconName}">`);
    }
  }

  connectedCallback() {
    super.connectedCallback();

    const el = document.createElement("fa-icon-chooser");
    el.handleQuery = FaPickerLogic.handleQuery;
    el.getUrlText = FaPickerLogic.getUrlText;
    el.addEventListener("finish", FaPickerLogic.handleResult);
    this.picker = el;
  }

  protected render() {
    return html` <div id="fa-icon-chooser-container">${this.picker}</div> `;
  }
}
