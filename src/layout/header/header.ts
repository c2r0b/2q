import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';

import './editToggle';
import './userButton';
import './systemButton';

import { sharedStyles } from '../shared.styles';

@customElement('top-header')
export class Header extends LitElement {
  static readonly styles = [sharedStyles];

  render() {
    return html`
      <div class="relative flex bg-white">
        <div class="flex-1">
          <a class="btn btn-ghost normal-case text-xl">My First App</a>
        </div>
        <div class="flex-none">
          <edit-toggle></edit-toggle>
          <system-button></system-button>
          <user-button></user-button>
        </div>
      </div>
    `;
  }
}