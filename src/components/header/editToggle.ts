import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';

import shared from '../shared.css';

@customElement('edit-toggle')
export class EditToggle extends LitElement {
  static readonly styles = [shared];

  _handleEditToggle(e) {
    this.dispatchEvent(new CustomEvent('editToggle',{
      detail: { message: e.currentTarget.checked },
      composed: true
    }));
  }

  render() {
    return html`
      <div class="form-control">
        <label class="label cursor-pointer">
          <span class="label-text">Edit</span> 
          <input type="checkbox" class="toggle" @change="${this._handleEditToggle}" />
        </label>
      </div>
    `;
  }
}