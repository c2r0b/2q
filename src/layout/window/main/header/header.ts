import { html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { StyledElement } from '../../../../shared/styled.element';
import { faEllipsis, faGear, faUser } from '@fortawesome/free-solid-svg-icons';

import { headerStyles } from './header.styles';

import "../footer";
import "../../../../ui/button";
import "../../../../ui/tooltip";
import "../../../../ui/context-menu";

declare const process: {
  env: {
    PACKAGE_VERSION: string;
  };
}

@customElement('app-header')
export class AppHeader extends StyledElement(headerStyles) {
  private get contextOptions() {
      return [
      { label: 'My first context', disabled: true, action: () => console.log('First option selected') },
      {type: 'divider'},
      { label: 'Manage context...', icon: faGear, action: () => console.log('Third option selected') },
    ];
  }

  private _handleSessionClick() {
    console.log('session clicked');
  }

  private _handleSettingsClick() {
    console.log('settings clicked');
  }

  protected render() {
    return html`
      <div class="w-16 flex flex-col justify-between h-full border-r border-r-gray-200 dark:border-r-gray-700 bg-white dark:bg-black">
        <div class="normal-case text-2xl rotate-90 inline-block whitespace-nowrap pl-4 py-3 word-spacing cursor-default">
          My First Context
        </div>
        <div>
          <div class="flex flex-col gap-2 px-4 py-3">
            <qui-context-menu .options="${this.contextOptions}">
              <qui-tooltip text="Context" orientation="right">
                <qui-button
                  aria-label="Change selected context"
                  .icon="${faEllipsis}"
                  @click="${this._handleSettingsClick}"
                ></qui-button>
              </qui-tooltip>
            </qui-context-menu>
            <qui-tooltip text="Session" orientation="right">
              <qui-button
                aria-label="Session info"
                .icon="${faUser}"
                @click="${this._handleSessionClick}"
              ></qui-button>
            </qui-tooltip>
            <qui-tooltip text="Settings" orientation="right">
              <qui-button
                aria-label="Settings"
                .icon="${faGear}"
                @click="${this._handleSettingsClick}"
              ></qui-button>
            </qui-tooltip>
          </div>
          <app-footer>
            <span>v${process.env.PACKAGE_VERSION}</span>
          </app-footer>
        </div>
      </div>
    `;
  }
}