import { ApolloClientElement } from "@apollo-elements/components/apollo-client";
import { client } from "./client";

import "./styles/global.scss";

// icons setup
import { FontAwesomeIcon } from "@riovir/wc-fontawesome";
customElements.define("fa-icon", FontAwesomeIcon);

// localization
import i18next from "i18next";
import { initLitI18n } from "lit-i18n";
import { translations } from "./locales";

i18next.use(initLitI18n).init({
  lng: "en",
  resources: {
    en: {
      translation: translations.en,
    },
  },
});

import "./app";

const clientWrapper = document.getElementById("client") as ApolloClientElement;

clientWrapper.client = client;

customElements
  .whenDefined("main-app")
  .then(() => document.body.removeAttribute("unresolved"));
