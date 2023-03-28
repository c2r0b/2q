import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';

import { faGear } from '@fortawesome/free-solid-svg-icons';

import shared from '../shared.css';

@customElement('system-button')
export class UserButton extends LitElement {
  static readonly styles = [shared];

  render() {
    return html`
      <div class="dropdown dropdown-en®d">
        <div class="tooltip-bottom" data-tip="Settings">
          <label tabindex="0" class="btn btn-ghost btn-circle">
            <fa-icon .icon=${faGear}></fa-icon>
          </label>
        </div>
        <ul tabindex="0" class="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
          <li>
            <a>
              Users
            </a>
          </li>
          <li>
            <a>
              Billing
            </a>
          </li>
        </ul>
      </div>
    `;
  }
}