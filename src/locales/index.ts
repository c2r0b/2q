import en from "./en.json";

// export the translations for the app
export const translations = {
  en,
};

// construct the type of the translations strings available from the en.json file
export type TranslationKey = keyof typeof en;

// export a function to translate strings with type safety
import { translate } from "lit-i18n";
export const t = (key: TranslationKey) => translate(key);
