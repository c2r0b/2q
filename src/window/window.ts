import { html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { listen } from "@tauri-apps/api/event";
import { invoke } from "@tauri-apps/api/core";
import { StyledElement } from "../shared/styled.element";

import { t, TranslationKey } from "src/locales";

import "./sections-list";
import "./section-content";

@customElement("main-window")
export class MainWindow extends StyledElement() {
  @state() private dbAvailable: boolean = false;
  @state() private sectionId: string = "";
  @state() private status: TranslationKey = "loading";

  // initialize database on startup (if setup is not needed)
  async init() {
    this.status = "gettingReady";

    const retryTimeout = setTimeout(() => {
      if (!this.dbAvailable) this.status = "retrying";
    }, 5000);

    const unlisten = await listen("db-initialized", () => {
      this.dbAvailable = true;
      clearTimeout(retryTimeout);
      unlisten();
    });

    invoke("init_db").then(async () => {
      this.status = "almostThere";
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
          <p>${t(this.status)}...</p>
        </div>
      `;
    }

    return html`
      <div class="flex h-full bg-gray-50 dark:bg-gray-900">
        <sections-list-menu
          @sectionChange="${this._handleSectionChange}"
        ></sections-list-menu>

        <section-content sectionId="${this.sectionId}"></section-content>
      </div>
    `;
  }
}
