import { html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { StyledElement } from '../../../shared/styled.element';

@customElement('modal-container')
export class ModalContainer extends StyledElement() {
	protected render() {
		return html`
			<div class="flex flex-col w-screen h-screen">
				<slot></slot>
			</div>
		`;
	}
}