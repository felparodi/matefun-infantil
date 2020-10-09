const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const { WebpackWarPlugin } = require('webpack-war-plugin');

module.exports = merge(common, {
   mode: 'production',
   devtool: 'source-map',
   output: {
       publicPath: '/matefun/matefun-infantil',
   },
   plugins: [
      ...common.plugins,
      new webpack.DefinePlugin({
          'process.env.MATEFUN_SERVER': JSON.stringify('origin/matefun')
      }),
      new WebpackWarPlugin({
        archiveName: 'matefun-infantil',
      })
  ]
});