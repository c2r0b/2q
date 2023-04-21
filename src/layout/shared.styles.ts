import { css } from 'lit';

export const sharedStyles = css`
  @tailwind base;
  @tailwind components;
  @tailwind utilities;

  [hidden] {
    display: none !important;
  }
`;