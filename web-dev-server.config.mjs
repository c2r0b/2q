import { esbuildPlugin } from '@web/dev-server-esbuild';
import { fromRollup } from '@web/dev-server-rollup';
import { resolveCodegenPlugin } from '@apollo-elements/create/helpers.js';

import rollupPostcss from 'rollup-plugin-postcss';
import rollupPostcssLit from 'rollup-plugin-postcss-lit';

import { buildConfig } from './esbuild.config.js';

const postcssPlugin = fromRollup(rollupPostcss);
const postcssLitPlugin = fromRollup(rollupPostcssLit);

export default {
  port: 8004,
  appIndex: 'index.html',
  rootDir: '.',
  nodeResolve: {
    exportConditions: ['production'],
  },
  mimeTypes: {
    'src/components/**/*.css': 'js',
    'src/style.css': 'css',
  },
  plugins: [
    esbuildPlugin(buildConfig(true)),
    resolveCodegenPlugin({ ts: true }),
    postcssPlugin(),
    postcssLitPlugin()
  ],
};
