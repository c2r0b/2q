import esbuild from 'rollup-plugin-esbuild';
import resolve from '@rollup/plugin-node-resolve';
import html from '@web/rollup-plugin-html';
import litcss from 'rollup-plugin-lit-css';
import postcss from '@deanc/esbuild-plugin-postcss';

//node_modules/.bin/postcss style.css
export default {
  input: 'index.html',

  output: {
    dir: 'build',
    format: 'es',
    sourcemap: true,
  },

  plugins: [
    esbuild({
      ts: true,
      minify: true,
      plugins: [postcss()]
    }),
    resolve(),
    html(),
    litcss(),
  ],
};