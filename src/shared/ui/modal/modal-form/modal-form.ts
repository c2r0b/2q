import { html } from "lit";
import { customElement } from "lit/decorators.js";
import { StyledElement } from "../../../styled.element";

@customElement("modal-form")
export class ModalForm extends StyledElement() {
  protected render() {
    return html`
      <div class="flex flex-col w-screen gap-4 p-5">
        <slot></slot>
      </div>
    `;
  }
}
