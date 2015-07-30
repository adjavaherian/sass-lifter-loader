//webpack.config.js
var webpack = require('webpack');
var path = require('path');
var fs = require('fs');

module.exports = {
    name: 'server side webpack',
    target: 'node',
    entry: {
        react: './example/App.jsx'
    },
    output: {
        libraryTarget: 'commonjs2',
        path: 'example/',
        filename: 'webpack.output.js'
    },
    resolve: {
        root: __dirname,
        fallback: __dirname + '/node_modules',
        modulesDirectories: ['node_modules'],
        extensions: ['', '.json', '.js', '.jsx', '.scss', '.png', '.jpg', '.jpeg', '.gif']
    },
    resolveLoader: {
        root: __dirname,
        alias: {
            'lift-sass': path.join(__dirname, './lift-sass-loader')
        }
    },
    module: {
        loaders: [
        { test: /\.scss$/,  loader: 'raw!sass'}
        , {
            test: /\.jsx$/,
            loaders: ['babel']
        }]
    },
    bail: true,
    cache: false,
    debug: true
};
