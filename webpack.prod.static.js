
const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
module.exports = merge(common, {
  // Specify the entry point for our app.
  // Specify the output file containing our bundled code
  plugins: [
    ...common.plugins,
    new webpack.DefinePlugin({
        'process.env.MATEFUN_SERVER': JSON.stringify('https://matefun.math.psico.edu.uy')
    }),
  ]
})