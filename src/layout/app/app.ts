import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { until } from 'lit/directives/until.js';

import "./outside";
import "./inside";

import { auth } from "../../utils/auth";

@customElement('main-app')
export class ApolloApp extends LitElement {
  @state() private loggedInContent = auth.init().then(() => {
    return html`<inside-app></inside-app>`;
  });

  protected render() {
    return html`
      <dl>
        ${until(this.loggedInContent, html`<outside-app></outside-app>`)}
      </dl>
    `;
  }
}