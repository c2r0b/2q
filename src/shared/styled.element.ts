import { LitElement, unsafeCSS } from "lit";

import globalStyles from "./styled.element.scss";

export const StyledElement = (style = undefined) => {
  return class extends LitElement {
    static readonly styles = style
      ? [unsafeCSS(globalStyles), unsafeCSS(style)]
      : [unsafeCSS(globalStyles)];
  };
};
