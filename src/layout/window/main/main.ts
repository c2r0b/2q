import { html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { StyledElement } from '../../../shared/styled.element';

import "./menu";
import "./section";
import "./header";

@customElement('main-window')
export class MainWindow extends StyledElement() {
  @state() private sectionId: string = "";

  private _handleSectionChange(e) {
    this.sectionId = e.detail.message;
  }

  protected render() {
    return html`
      <div class="flex h-full bg-gray-50 dark:bg-gray-900">
        <app-header></app-header>
        <side-menu
          @sectionChange="${this._handleSectionChange}"
        ></side-menu>
        
        <section-content
          sectionId="${this.sectionId}"
        ></section-content>
      </div>
    `;
  }
}