import { html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { StyledElement } from '../../../shared/styled.element';

@customElement('modal-footer')
export class ModalFooter extends StyledElement() {
	protected render() {
		return html`
			<div class="fixed bottom-0 left-0 right-0 flex justify-between px-5 bg-gray-100 dark:bg-gray-800 py-3">
				<div class="flex gap-5">
					<slot></slot>
				</div>
			</div>
		`;
	}
} 