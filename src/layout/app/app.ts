import { customElement } from 'lit/decorators.js';
import { StyledElement } from '../../shared/styled.element';
import Navigo from 'navigo';

import "../window/main/main";
import "../window/add-section/add-section";

import { appStyles } from './app.styles';

@customElement('main-app')
export class ApolloApp extends StyledElement(appStyles) {
  connectedCallback(): void {
    super.connectedCallback();
    
    // route windows (main window, modals, etc.)
    const router = new Navigo("/");
    router.on("/", function () {
      document.getElementById("window").innerHTML = `<main-window></main-window>`;
    });
    router.on("/add-section", function () {
      document.getElementById("window").innerHTML = `<add-section></add-section>`;
    });
    router.resolve();
  }
}