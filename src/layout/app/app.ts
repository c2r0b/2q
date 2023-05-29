import { customElement } from 'lit/decorators.js';
import { StyledElement } from '../../shared/styled.element';
import Navigo from 'navigo';

import "../window/main/main";

import { appStyles } from './app.styles';

@customElement('main-app')
export class ApolloApp extends StyledElement(appStyles) {
  connectedCallback(): void {
    super.connectedCallback();
    const router = new Navigo("/");
    router.on("/", function () {
      document.getElementById("window").innerHTML = `<main-window></main-window>`;
    });
    router.navigate("/");
    console.log(router);
  }
}