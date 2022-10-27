const webpack = require('webpack');
const HtmlWebPackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = webpack.container.ModuleFederationPlugin;
const path = require('path');

module.exports = {
  entry: './src/index',
  devtool: "eval-cheap-source-map",
  mode: 'development',
  output: {
    publicPath: 'auto'
  },
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js", ".json"],
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    port: 4800,
    headers: {
      "Access-Control-Allow-Origin": "*",
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
      }
    ],
  },
  optimization: {
    runtimeChunk: false,
  },
  experiments: {
    outputModule: true
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "shortlistIt",
      library: { type: 'module' },
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
