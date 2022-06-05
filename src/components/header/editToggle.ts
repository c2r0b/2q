import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('edit-toggle')
export class EditToggle extends LitElement {
  _handleEditToggle(e) {
    this.dispatchEvent(new CustomEvent('editToggle',{
      detail: { message: e.currentTarget.checked },
      composed: true
    }));
  }

  render() {
    return html`
      <input
        type="checkbox"
        label="Edit"
        @change="${this._handleEditToggle}"
      />
      <label>Edit</label>
    `;
  }
}