import { html } from "lit";
import "../shared/ui/toggle/toggle";

export interface QuiToggleProps {
  /**
   * Label for the toggle
   * @default "Toggle"
   * @type {string}
   * @memberof QuiToggleProps
   * @example
   * <qui-toggle label="Toggle"></qui-toggle>
   */
  label?: string;
  /**
   * Callback function for when the toggle is clicked
   * @default () => {}
   * @type {Function}
   * @memberof QuiToggleProps
   * @example
   * <qui-toggle onClick={() => console.log("clicked")}></qui-toggle>
   */
  onClick?: () => void;
}

/**
 * Toggle component
 * @example
 * <qui-toggle label="Toggle" onClick={() => console.log("clicked")}></qui-toggle>
 */
export const QuiToggle = ({ label, onClick }: QuiToggleProps) => html`
  <qui-toggle .label=${label} @click=${onClick}></qui-toggle>
`;
