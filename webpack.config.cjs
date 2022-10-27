const webpack = require('webpack');
const HtmlWebPackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");

const deps = require("./package.json").dependencies;

module.exports = {
  devtool: "eval-cheap-source-map",
  mode: 'development',
  output: {
    uniqueName: 'shortlist-it',
    publicPath: 'auto',
    scriptType: 'text/javascript'
  },
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js", ".json"],
  },
  devServer: {
    port: 4800,
    historyApiFallback: true,
    headers: {
      "Access-Control-Allow-Origin": "*"
    }
  },
  module: {
    rules: [
      {
        test: /\.m?js/,
        type: "javascript/auto",
        resolve: {
          fullySpecified: false,
        },
        mimetype: 'application/javascript'
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
        loader: "json-loader",
        mimetype: 'application/json'
      }
    ],
  },
  experiments: {
    outputModule: true
  },
  plugins: [
    new ModuleFederationPlugin({
      library: { type: "module" },
      name: "shortlistIt",
      filename: "remoteEntry.js",
      exposes: {
        './ShortlistItModule': './src/App.tsx',
      },
    }),
    new HtmlWebPackPlugin({
      template: "./src/index.html",
    }),
  ],
};
