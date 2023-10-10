import { html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { StyledElement } from '../../../../shared/styled.element';
import { faEllipsis, faGear, faUser } from '@fortawesome/free-solid-svg-icons';
import { showMenu } from 'tauri-plugin-context-menu';

import { headerStyles } from './header.styles';

import '../footer';
import '../../../../ui/button';
import '../../../../ui/tooltip';
import '../../../../ui/context-menu';

declare const process: {
  env: {
    PACKAGE_VERSION: string;
  };
};

@customElement('app-header')
export class AppHeader extends StyledElement(headerStyles) {
  private _handleContextClick() {
    return;
    showMenu({
      items: [
        {
          label: 'My first item',
          disabled: false,
          event: 'my_first_item',
        },
        {
          label: 'My second item',
          disabled: true,
          event: 'my_second_item',
        },
      ],
    });
  }

  private _handleSessionClick() {
    showMenu({
      items: [
        {
          label: 'My first item',
          disabled: false,
          event: 'my_first_item',
        },
        {
          label: 'My second item',
          disabled: true,
          event: 'my_second_item',
        },
      ],
    });
  }

  private _handleSettingsClick() {
    showMenu({
      items: [
        {
          label: 'My first item',
          disabled: false,
          event: 'my_first_item',
        },
        {
          label: 'My second item',
          disabled: true,
          event: 'my_second_item',
        },
      ],
    });
  }

  protected render() {
    return html`
      <div class='w-16 flex flex-col justify-between h-full border-r border-r-gray-200 dark:border-r-gray-700 '>
        <div class='normal-case text-xl rotate-90 inline-block whitespace-nowrap pl-4 py-3 word-spacing cursor-default'>
          My First Context
        </div>
        <div>
          <div class='flex flex-col gap-2 px-4 py-3'>
            <qui-tooltip text='Context' orientation='right'>
              <qui-button
                aria-label='Change selected context'
                .icon='${faEllipsis}'
                disabled
                @click='${this._handleContextClick}'
              ></qui-button>
            </qui-tooltip>
            <qui-tooltip text='Session' orientation='right'>
              <qui-button
                aria-label='Session info'
                .icon='${faUser}'
                @click='${this._handleSessionClick}'
              ></qui-button>
            </qui-tooltip>
            <qui-tooltip text='Settings' orientation='right'>
              <qui-button
                aria-label='Settings'
                .icon='${faGear}'
                @click='${this._handleSettingsClick}'
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
