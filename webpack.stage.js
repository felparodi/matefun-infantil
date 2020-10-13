const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        contentBase: './dist',
    },
    output: {
        publicPath: '/'
    },
    plugins: [
        ...common.plugins,
        new webpack.DefinePlugin({
            'process.env.MATEFUN_SERVER': JSON.stringify('https://www.fing.edu.uy/proyectos/matefun')
        })
    ]
});