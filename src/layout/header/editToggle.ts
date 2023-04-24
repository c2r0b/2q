import { html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { StyledElement } from '../../shared/styled.element';

import '../../ui/toggle/toggle';

@customElement('edit-toggle')
export class EditToggle extends StyledElement() {
  _handleEditToggle(e) {
    this.dispatchEvent(new CustomEvent('editToggle', {
      detail: { message: e.currentTarget.checked },
      composed: true
    }));
  }

  protected render() {
    return html`
      <div class="mt-2">
        <qui-toggle
          label="Edit"
          .onClick="${this._handleEditToggle}"
        ></qui-toggle>
      </div>
    `;
  }
}