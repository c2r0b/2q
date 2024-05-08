import { LitElement, unsafeCSS } from "lit";

import globalStyles from "./styled.global.scss";

export const StyledElement = (style = undefined) => {
  return class extends LitElement {
    static styles = style
      ? [unsafeCSS(globalStyles), unsafeCSS(style)]
      : [unsafeCSS(globalStyles)];
  };
};
