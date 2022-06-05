import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';

import './editToggle';

import style from './header.css';
import shared from '../shared.css';

@customElement('top-header')
export class Header extends LitElement {
  static readonly styles = [shared, style];

  render() {
    return html`
      <header>
        Gemo
        <edit-toggle></edit-toggle>
      </header>
    `;
  }
}