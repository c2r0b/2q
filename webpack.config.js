import { buildConfig } from "./esbuild.config.js";
import * as Sass from "sass-embedded";
import HtmlWebpackPlugin from "html-webpack-plugin";
import TsconfigPathsPlugin from "tsconfig-paths-webpack-plugin";

import postcss from "postcss";
import postcssNesting from "postcss-nesting";
import postcssDiscardComments from "postcss-discard-comments";
import autoprefixer from "autoprefixer";
import tailwindcss from "tailwindcss";

const processor = postcss(
  postcssNesting(),
  postcssDiscardComments(),
  autoprefixer(),
  tailwindcss("./tailwind.config.js")
);

export default {
  entry: "./src/main.ts",
  mode: process.env.NODE_ENV === "production" ? "production" : "development",
  stats: { warnings: false },
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        loader: "esbuild-loader",
        resolve: {
          fullySpecified: false,
        },
        options: buildConfig(true),
      },
      {
        test: /\.(graphql|gql)$/,
        exclude: /node_modules/,
        loader: "graphql-tag/loader",
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        // only scss files under /src/styles
        test: /src\/styles\/.*\.scss$/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        // only scss under /src/shared
        test: /src\/shared\/.*\.scss$/,
        loader: "lit-css-loader",
        options: {
          // Use Sass to process Carbon and PostCSS for Tailwind
          transform: (data, { filePath }) =>
            processor.process(
              Sass.compile(filePath, {
                data,
                loadPaths: ["node_modules"],
              }).css.toString(),
              {
                from: filePath,
              }
            ).css,
        },
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
    plugins: [new TsconfigPathsPlugin()],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./index.html",
      filename: "index.html",
    }),
  ],
  devServer: {
    compress: true,
    port: 8004,
    client: {
      overlay: {
        errors: false,
        warnings: false,
        runtimeErrors: false,
      },
    },
  },
};
