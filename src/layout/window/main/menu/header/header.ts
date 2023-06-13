import { html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { StyledElement } from '../../../../../shared/styled.element';

import { faSync } from '@fortawesome/free-solid-svg-icons';

import '../../../../../ui/tooltip';

@customElement('aside-header')
export class AsideHeader extends StyledElement() {
  @state() private sectionTitle: string = "";

  private _handleFilterInput(e) {
    this.sectionTitle = e.detail.value as string || "";
  }

  private _handleRefresh() {
    this.dispatchEvent(new CustomEvent('refresh'));
  }
  
  protected render() {
    return html`
      <div class="flex gap-2 px-3 py-2">
        <qui-input
          placeholder="Filter sections"
          .value=${this.sectionTitle}
          @new-value=${this._handleFilterInput}
        ></qui-input>
        <qui-tooltip text="Refresh" orientation="below">
          <qui-button
            aria-label="Refresh sections"
            .icon=${faSync}
            @click=${this._handleRefresh}
          ></qui-button>
        </qui-tooltip>
        <add-btn
          @add="${this._handleRefresh}"
        ></add-btn>
      </div>
    `;
  }
}