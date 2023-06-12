import { html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { StyledElement } from '../../shared/styled.element';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

import { loaderStyles } from './loader.styles';

@customElement('qui-loader')
export class QuiLoader extends StyledElement(loaderStyles) {
  protected render() {
    return html`
      <div class="class="animate-spin">
        <fa-icon .icon="${faSpinner}"></fa-icon>
      </div>
    `;
  }
}