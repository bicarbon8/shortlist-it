const { defineConfig } = require('cypress');
const webpackConfig = require('./webpack.config.cjs');

module.exports = defineConfig({
    component: {
        devServer: {
            framework: 'react',
            bundler: 'webpack',
            webpackConfig
        },
        viewportWidth: 800
    }
});