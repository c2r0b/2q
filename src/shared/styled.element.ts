import { LitElement, unsafeCSS } from "lit";

import tailwindElement from "./styled.global.css?inline";

export const StyledElement = (style = undefined) => {
  return class extends LitElement {
    static styles = style
      ? [unsafeCSS(tailwindElement), unsafeCSS(style)]
      : [unsafeCSS(tailwindElement)];
  };
};
