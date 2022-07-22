import esbuild from 'rollup-plugin-esbuild';
import resolve from '@rollup/plugin-node-resolve';
import html from '@web/rollup-plugin-html';
import litcss from 'rollup-plugin-lit-css';
import postcss from 'rollup-plugin-postcss';

export default {
  input: 'index.html',

  output: {
    dir: 'build',
    format: 'es',
    sourcemap: true,
  },

  plugins: [
    postcss(),
    esbuild({ ts: true, minify: true }),
    resolve(),
    html(),
    litcss(),
  ],
};