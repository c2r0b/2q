import esbuild from 'rollup-plugin-esbuild';
import resolve from '@rollup/plugin-node-resolve';
import html from '@web/rollup-plugin-html';
import litcss from 'rollup-plugin-lit-css';

import { buildConfig } from './esbuild.config.js';

export default {
  input: 'index.html',

  output: {
    dir: 'build',
    format: 'es',
    sourcemap: true,
  },

  plugins: [
    esbuild(buildConfig(false)),
    resolve(),
    html(),
    litcss(),
  ],
};