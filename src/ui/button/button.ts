import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';

import { faGear } from '@fortawesome/free-solid-svg-icons';

@customElement('qui-button')
export class QuiButton extends LitElement {
  static readonly styles = [];

  render() {
    return html`
      <div class="tooltip-bottom" data-tip="Settings">
        <label tabindex="0" class="btn btn-ghost btn-circle">
          <fa-icon .icon=${faGear}></fa-icon>
        </label>
      </div>
    `;
  }
}