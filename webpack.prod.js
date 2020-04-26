const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
   mode: 'production',
   devtool: 'source-map',
   plugins: [
      ...common.plugins,
      new webpack.DefinePlugin({
          'process.env.MATEFUN_SERVER': JSON.stringify('http://localhost:8080')
      }),
  ]
});