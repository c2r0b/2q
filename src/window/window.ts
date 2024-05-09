import { html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { listen } from "@tauri-apps/api/event";
import { invoke } from "@tauri-apps/api/core";
import { StyledElement } from "../shared/styled.element";

import "./sections-list";
import "./section";
import "./aside";

@customElement("main-window")
export class MainWindow extends StyledElement() {
  @state() private dbAvailable: boolean = false;
  @state() private sectionId: string = "";
  @state() private status: string = "Loading";

  // initialize database on startup (if setup is not needed)
  async init() {
    this.status = "Getting ready ...";

    const retryTimeout = setTimeout(() => {
      if (!this.dbAvailable) this.status = "Retrying ...";
    }, 5000);

    const unlisten = await listen("db-initialized", () => {
      this.dbAvailable = true;
      clearTimeout(retryTimeout);
      unlisten();
    });

    invoke("init_db").then(async () => {
      this.status = "Almost there ...";
    });
  }

  // check if setup is needed
  async connectedCallback() {
    super.connectedCallback();
    this.init();
  }

  private _handleSectionChange(e) {
    this.sectionId = e.detail.message;
  }

  protected render() {
    if (!this.dbAvailable) {
      return html`
        <div
          class="w-full h-full flex items-center justify-center text-xl font-bold"
        >
          <p>${this.status}</p>
        </div>
      `;
    }

    return html`
      <div class="flex h-full bg-gray-50 dark:bg-gray-900">
        <app-aside></app-aside>

        <sections-list-menu
          @sectionChange="${this._handleSectionChange}"
        ></sections-list-menu>

        <section-content sectionId="${this.sectionId}"></section-content>
      </div>
    `;
  }
}
