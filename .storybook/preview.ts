import "./style.css";

import type { Preview } from "@storybook/web-components";
import { themes } from "@storybook/theming";

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    backgrounds: { 
      disable: true 
    },
    docs: {
      theme: themes.dark,
    },
    darkMode: {
      darkClass: 'darkClass',
      lightClass: 'lightClass',
      stylePreview: true,
    },
  },
};

export default preview;
