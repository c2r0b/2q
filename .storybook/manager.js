import { addons } from '@storybook/manager-api';
import { FORCE_RE_RENDER } from '@storybook/core-events';
import { themes } from '@storybook/theming';
import QUITheme from './QUITheme';

addons.setConfig({
  theme: QUITheme,
});

const getColorScheme = matches => {
  return matches ? 'dark' : 'light';
};

const queryWindowMatchMedia = () => {
  return window && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');
};

// automatically switch light/dark theme based on system pref.
addons.register('auto-theme-switcher', api => {
  let currTheme;

  queryWindowMatchMedia().addEventListener('change', e => {
    const updatedTheme = getColorScheme(e.matches);
    if (currTheme !== updatedTheme) {
      currTheme = updatedTheme;
      api.setOptions({
        theme: themes[updatedTheme],
        docs: {
          theme: themes[updatedTheme],
        }
      });
      addons.getChannel().emit(FORCE_RE_RENDER);

    }
  });
});