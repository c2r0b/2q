import { html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { StyledElement } from '../../../shared/styled.element';

import '../../../ui/button';
import '../../../ui/modal/modal-container';
import '../../../ui/modal/modal-form';
import '../../../ui/modal/modal-footer';

export const windowOptions = {
	url: '/add-context',
	title: '2Q - Add Context',
	width: 630,
	height: 400,
	resizable: false,
};

interface SetupData {
	dbType?: 'arango' | 'neo4j';
	dbHost?: string;
	dbUser?: string;
	dbPassword?: string;
	gptKey?: string;
}

@customElement('add-context-window')
export class CustomSetupWindow extends StyledElement() {
	@state() private data: SetupData = {};

	private _handleInput(e, field) {
		this.data[field] = e.detail.value as string || "";
	}

	protected render() {
		return html`
			<modal-container>
				<modal-form>
					<p class="font-bold text-xl">Database</p>
					<div class="flex flex-row gap-3 flex-wrap box-border">
						<qui-field label="DB type" class="w-72">
							<qui-input
								placeholder="arango|neo4j"
								.value=${this.data.dbType ?? ''}
								@new-value=${(e) => this._handleInput(e, 'dbType')}
							></qui-input>
						</qui-field>
						<qui-field label="DB host" class="w-72">
							<qui-input
								placeholder="http://localhost:8529"
								.value=${this.data.dbHost ?? ''}
								@new-value=${(e) => this._handleInput(e, 'dbHost')}
							></qui-input>
						</qui-field>
						<qui-field label="DB user" class="w-72">
							<qui-input
								placeholder="root"
								.value=${this.data.dbUser ?? ''}
								@new-value=${(e) => this._handleInput(e, 'dbUser')}
							></qui-input>
						</qui-field>
						<qui-field label="DB password" class="w-72">
							<qui-input
								placeholder="openSesame"
								.value=${this.data.dbPassword ?? ''}
								@new-value=${(e) => this._handleInput(e, 'dbPassword')}
							></qui-input>
						</qui-field>
					</div>
					<p class="font-bold text-xl">Machine Learning</p>
					<qui-field label="GPT-3 key">
						<qui-input
							placeholder="XXXXXXXXXXXXXXXX"
							.value=${this.data.gptKey ?? ''}
							@new-value=${(e) => this._handleInput(e, 'gptKey')}
						></qui-input>
					</qui-field>
				</modal-form>
				<modal-footer>
					<qui-button
						aria-label="Proceed"
					>
						Proceed
					</qui-button>
				</modal-footer>
			</modal-container>
    `;
	}
}