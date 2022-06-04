import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';

import style from './header.css';
import shared from '../shared.css';

@customElement('top-header')
export class Header extends LitElement {
  static readonly styles = [shared, style];

  _handleEditToggle(e) {
    this.dispatchEvent(new CustomEvent('editToggle',{
      detail: { message: e.currentTarget.checked }
    }));
  }

  render() {
    return html`
      <header>
        Gemo
        <input type="checkbox" @change="${this._handleEditToggle}"/>
        <label>Edit</label>
      </header>
    `;
  }
}