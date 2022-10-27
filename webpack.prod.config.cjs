const config = require('./webpack.config.cjs');

module.exports = {
  ...config,
  devtool: undefined,
  mode: "production",
  optimization: {
    splitChunks: {
      chunks: 'all',
      maxSize: 20000,
    }
  },
};
