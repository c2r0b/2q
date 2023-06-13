import { html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { StyledElement } from '../../../../../shared/styled.element';

@customElement('aside-footer')
export class AsideFooter extends StyledElement() {
  protected render() {
    return html`
      <div class="w-full absolute bottom-0 left-0 right-0 flex justify-between">
        <app-footer class="w-full">
          
        </app-footer>
      </div>
    `;
  }
}