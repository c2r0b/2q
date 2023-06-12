import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { WebviewWindow } from '@tauri-apps/api/window';
import { listen } from '@tauri-apps/api/event';

import '../../../../ui/button/button';

import { windowOptions as SectionWindowOptions } from '../../add-section/add-section';

@customElement('add-btn')
export class AddButton extends LitElement {
  static readonly styles = [];

  private async _handleAddClick() {
    const webview = new WebviewWindow('addNewSection', SectionWindowOptions);
    webview.once('tauri://created', async () => {
      // listen for section creation
      const unlisten = await listen('section-created', async () => {
        this.dispatchEvent(new CustomEvent('add'));
        unlisten();
      });
    });
  }
  
  protected render() {
    return html`
      <qui-button
        aria-label="Add new section"
        .icon="${faPlus}"
        @click="${this._handleAddClick}"
      />
    `;
  }
}
