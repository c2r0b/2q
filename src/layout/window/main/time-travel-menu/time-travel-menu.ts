import { ApolloQueryController } from '@apollo-elements/core';
import { html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { StyledElement } from '../../../../shared/styled.element';

import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';

import { TimeTravelSupportQuery } from './queries/TimeTravelSupport.query.graphql.js';

@customElement('time-travel-menu')
export class TimeTravelMenu extends StyledElement() {
  query = new ApolloQueryController(this, TimeTravelSupportQuery);
  
  private _handleUndo: unknown;
  private _handleRedo: unknown;
  
  protected render() {
    return html`
      <qui-tooltip text="Undo" orientation="below">
        <qui-button
          aria-label="Undo last change"
          .icon="${faArrowLeft}"
          ?disabled="${!this.query.data?.hasTimetravelSupport}"
          @click="${this._handleUndo}"
        ></qui-button>
      </qui-tooltip>
      <qui-tooltip text="Redo" orientation="below">
        <qui-button
          aria-label="Redo last change"
          .icon="${faArrowRight}"
          ?disabled="${!this.query.data?.hasTimetravelSupport}"
          @click="${this._handleRedo}"
        ></qui-button>
      </qui-tooltip>
    `;
  }
}
