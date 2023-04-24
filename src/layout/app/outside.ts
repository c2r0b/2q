import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';

import { appStyles } from './app.styles';

@customElement('outside-app')
export class OutsideApp extends LitElement {
  static readonly styles = [appStyles];

  protected render() {
    return html`
      <span>Authenticating...</span>
    `;
  }
}
