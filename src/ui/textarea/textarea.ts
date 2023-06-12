import { html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { StyledElement } from '../../shared/styled.element';

@customElement('qui-textarea')
export class QuiTextarea extends StyledElement() {
  @property ({ type: String }) placeholder = undefined;
  @property ({ type: String }) defaultValue = undefined;
  @property ({ type: Boolean }) disabled = false;
  @property ({ type: String }) height = undefined;

  @state() private value: string = this.defaultValue || "";

  private dispatchInput(event: InputEvent) {
    const value = (event.target as HTMLInputElement).value;
    this.dispatchEvent(new CustomEvent('new-value', {
      detail: {
        value
      }
    }));
    this.value = value;
  }

  protected render() {
    return html`
      <textarea
        class="px-2 py-1 w-full bg-gray-200 hover:bg-gray-600 rounded-sm dark:bg-gray-700 dark:border-gray-600"
        placeholder=${this.placeholder}
        .value=${this.value}
        @input=${this.dispatchInput}
        ?disabled=${this.disabled}
      >
      </textarea>
    `;
  }
}