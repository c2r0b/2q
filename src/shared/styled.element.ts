import { LitElement, unsafeCSS } from "lit";

import tailwindElement from "./styled.global.css";

export const StyledElement = (style = undefined) => {
  return class extends LitElement {
    static styles = style ? [tailwindElement, unsafeCSS(style)] : [tailwindElement];
  };
};