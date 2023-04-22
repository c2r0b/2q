import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';

import { appStyles } from './app.styles';
import { sharedStyles } from '../shared.styles';

@customElement('outside-app')
export class OutsideApp extends LitElement {
  static readonly styles = [sharedStyles, appStyles];

  render() {
    return html`
      <span>Authenticating...</span>
    `;
  }
}
