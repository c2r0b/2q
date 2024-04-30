import { ApolloMutationController } from '@apollo-elements/core';
import { html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { v4 as uuid } from 'uuid';
import { StyledElement } from '../../../shared/styled.element';
//import { appWindow } from '@tauri-apps/api/webviewWindow';
import { emit } from '@tauri-apps/api/event';

import '../../../ui/button';
import '../../../ui/textarea';
import '../../../ui/loader';
import '../../../ui/field';
import '../../../ui/input';
import '../../../ui/picker/icon';
import '../../../ui/modal/modal-container';
import '../../../ui/modal/modal-form';
import '../../../ui/modal/modal-footer';

import { SendChatMessage } from '../../../shared/mutations/SendChatMessage.mutation.graphql.js';
import { CreateSections } from './mutations/CreateSections.mutation.graphql.js';

export const windowOptions = {
	url: '/add-section',
    title: '2Q - Add new section',
    width: 600,
    height: 300,
	resizable: false,
};

@customElement('add-section')
export class AddSection extends StyledElement() {
	@state() private sectionTitle: string = "";
	@state() private sectionDescription: string = "";
	@state() private sectionParent: string = "";
  
	sendChatMessageMutation = new ApolloMutationController(this, SendChatMessage)
	createSectionsMutation = new ApolloMutationController(this, CreateSections)

	private _handleTitleInput(e) {
		this.sectionTitle = e.detail.value as string || "";
	}

	private _handleDescriptionInput(e) {
		this.sectionDescription = e.detail.value as string || "";
	}

	private async _handleProceed() {
		if (!this.sectionTitle) {
			alert("Invalid section name");
			return;
		}
		if (!this.sectionDescription) {
			alert("Invalid section description");
			return;
		}

		// generate mutation from gpt
		this.sendChatMessageMutation.variables = {
		  message: this.sectionDescription
		};
		let chatReply;
		try {
			const chatMutationResponse = await this.sendChatMessageMutation.mutate();
			chatReply = chatMutationResponse.data.sendChatMessage
		} catch (e) {
			alert("Failed to generate section settings" + e.message);
			return;
		}

		// add section to the database
		this.createSectionsMutation.variables = {
			input: [
				{
					id: uuid(),
					title: this.sectionTitle,
					description: chatReply
				}
			]
		};
		try {
			await this.createSectionsMutation.mutate();
		} catch (e) {
			alert("Failed to create section: " + e.message);
			return;
		}

		// close the window
		await emit('section-created');
		//await appWindow.close();
	}

	private isLoading() {
		return this.sendChatMessageMutation.loading || this.createSectionsMutation.loading;
	}

	protected render() {
		return html`
			<modal-container>
				<modal-form>
					<div class="flex flex-row gap-3">
						<qui-field label="Title">
							<qui-input
								placeholder="Section title"
								?disabled=${this.isLoading()}
								.value=${this.sectionTitle}
								@new-value=${this._handleTitleInput}
							></qui-input>
						</qui-field>
						<qui-field label="Icon">
							<qui-icon-picker></qui-icon-picker>
						</qui-field>
						<qui-field label="Parent">
							<qui-select
								?disabled=${this.isLoading()}
								.value=${this.sectionParent}
							>
								<option value="0">None</option>
							</qui-select>
						</qui-field>
					</div>
					<qui-field label="Description">
						<qui-textarea
							placeholder="Create a new section to..."
							?disabled=${this.isLoading()}
							@new-value=${this._handleDescriptionInput}
						></qui-textarea>
					</qui-field>
				</modal-form>
				<modal-footer>
					<qui-button
						aria-label="Save section"
						?disabled=${this.isLoading()}
						@click=${() => this._handleProceed()}
					>
						Proceed
					</qui-button>
					<qui-loader ?hidden=${!this.isLoading()}></qui-loader>
				</modal-footer>
			</modal-container>
    `;
	}
}