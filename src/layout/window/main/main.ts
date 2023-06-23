import { html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { StyledElement } from '../../../shared/styled.element';

import "./menu";
import "./section";
import "./header";
import "./time-travel-menu";

@customElement('main-window')
export class MainWindow extends StyledElement() {
  @state() private sectionId: string = "";

  private _handleSectionChange(e) {
    this.sectionId = e.detail.message;
  }

  protected render() {
    return html`
      <div data-tauri-drag-region class="flex gap-2 h-10 border-b pt-2 pr-2 border-b-gray-200 dark:border-b-gray-700 select-none flex justify-end fixed top-0 left-0 right-0 rounded-t-3xl z-10">
        <time-travel-menu></time-travel-menu>
      </div>
      <div class="flex h-full bg-gray-50 dark:bg-gray-900 absolute top-10 bottom-0">
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