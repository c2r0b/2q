import { html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { StyledElement } from '../../../shared/styled.element';

import "./header";
import "./footer";
import "./menu";
import "./section";

@customElement('main-window')
export class MainWindow extends StyledElement() {
  @state() private sectionId: string = "";
  @state() private canEdit: boolean = false;

  private _handleSectionChange(e) {
    this.sectionId = e.detail.message;
  }

  private _handleEditToggle(e) {
    this.canEdit = e.detail.message;
  }

  protected render() {
    return html`
      <div class="flex h-full bg-gray-50 dark:bg-gray-900">
        <aside class="flex-none w-1/3 h-full relative">
          <aside-header></aside-header>
          <side-menu
            .canEdit=${this.canEdit}
            @sectionChange="${this._handleSectionChange}"
          ></side-menu>
          <aside-footer
            @editToggle="${this._handleEditToggle}"
          ></aside-footer>
        </aside>

        <section-content
          sectionId="${this.sectionId}"
        ></section-content>
      </div>
    `;
  }
}