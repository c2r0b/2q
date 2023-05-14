import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';

import { faCog } from '@fortawesome/free-solid-svg-icons';

@customElement('qui-button')
export class QuiButton extends LitElement {
  protected render() {
    return html`
      <div class="tooltip-bottom" data-tip="Settings">
        <label tabindex="0" class="btn btn-ghost btn-circle">
          <fa-icon .icon=${faCog}></fa-icon>
        </label>
      </div>
    `;
  }
}