import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';

import { faGear } from '@fortawesome/free-solid-svg-icons';

import { sharedStyles } from '../shared.styles';

//import 'src/ui/button/button';

@customElement('system-button')
export class SystemButton extends LitElement {
  static readonly styles = [sharedStyles];
  //<qui-button></qui-button>
  
  protected render() {
    return html`
      <div class="dropdown dropdown-end">
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