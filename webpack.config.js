const webpack = require('webpack');
const HtmlWebPackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");

const deps = require("./package.json").dependencies;

module.exports = {
  devtool: "eval-cheap-source-map",
  output: {
    uniqueName: 'shortlist-it',
    publicPath: 'auto',
    scriptType: 'text/javascript'
  },
  optimization: {
    runtimeChunk: false
  },
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js", ".json"],
  },
  devServer: {
    port: 4800,
    historyApiFallback: true,
  },
  module: {
    rules: [
      {
        test: /\.m?js/,
        type: "javascript/auto",
        resolve: {
          fullySpecified: false,
        },
      },
      { 
        test: /\.(jpe?g|gif|png|svg|woff|ttf|wav|mp3|ico)$/, 
        loader: "file-loader",
        options: {
          name: '[name].[ext]'
        }
      },
      { 
        test: /(\.nojekyll)$/, 
        loader: "file-loader",
        options: {
          name: '.nojekyll',
        }
      },
      {
        test: /\.(css|s[ac]ss)$/i,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
      {
        test: /\.(ts|tsx|js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.(json)$/,
        loader: "json-loader"
      }
    ],
  },
  plugins: [
    // This makes it possible for us to safely use env vars on our code
    new ModuleFederationPlugin({
      name: "shortlistIt",
      filename: "remoteEntry.js",
      remotes: {},
      exposes: {
        './ShortlistItModule': './src/App.tsx',
      },
    }),
    new HtmlWebPackPlugin({
      template: "./src/index.html",
    }),
  ],
};
