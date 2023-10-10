import { html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { StyledElement } from '../../shared/styled.element';

@customElement('qui-input')
export class QuiInput extends StyledElement() {
  @property ({ type: String }) placeholder = undefined;
  @property ({ type: String }) defaultValue = undefined;
  @property ({ type: Boolean }) disabled = false;

  // debounce in milliseconds for input event
  @property ({ type: Number }) debounce = 0;
  private debounceTimeout: NodeJS.Timeout | undefined;
  
  @state() private value: string = this.defaultValue || "";

  private _handleInput(event: InputEvent) {
    if (this.debounceTimeout) {
      clearTimeout(this.debounceTimeout);
    }

    const value = (event.target as HTMLInputElement).value;
    this.value = value;

    this.debounceTimeout = setTimeout(() => {
      this.dispatchEvent(new CustomEvent('new-value', {
        detail: {
          value
        }
      }));
    }, this.debounce);
  }

  protected render() {
    return html`
      <input
        class="px-2 py-1 w-full bg-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-sm dark:bg-gray-700 dark:border-gray-600"
        placeholder=${this.placeholder}
        ?disabled=${this.disabled}
        .value=${this.value}
        @input=${this._handleInput}
      />
    `;
  }
}