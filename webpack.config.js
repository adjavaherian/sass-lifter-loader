//webpack.config.js
var webpack = require('webpack');
var path = require('path');
var fs = require('fs');
var ProgressPlugin = require('./progress-plugin');
var CachePlugin = require("webpack/lib/CachePlugin");
var myCache = {};

module.exports = {
    name: 'server side webpack',
    target: 'node',
    entry: {
        react: './example/App.jsx'
    },
    output: {
        libraryTarget: 'commonjs2',
        path: path.join(__dirname, 'example', 'dist'),
        filename: 'webpack.output.js',
        publicPath: 'images/'
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
            'lift-sass': path.join(__dirname) + '?outputStyle=compressed&testString=scss&prefix=images&manifest=rev-manifest&outputDir=' + path.join(__dirname, 'example', 'dist'),
            'logger-loader': path.join(__dirname, 'logger-loader'),
            'noop-loader': path.join(__dirname, 'noop-loader'),
            'passthru-loader': path.join(__dirname, 'passthru-loader'),
            'manifest-loader': path.join(__dirname, 'manifest-loader') + '?limit=10000&hash=sha512&digest=hex&relativeSplit=images/&prefix=example/images&manifest=rev-manifest&outputDir=' + path.join(__dirname, 'example', 'dist')
        }
    },
    plugins: [
        new CachePlugin(myCache),
        new ProgressPlugin()
    ],
    module: {
        loaders: [
        {
            test: /\.scss$/,
            loaders: [
                'noop-loader'
            ]
        }
        , {
            test: /\.(jpe?g|png|gif|svg)$/i,
            loaders: [
                'manifest-loader'
            ]
        }
        , {
            test: /\.jsx$/,
            loaders: ['babel']
        }]
    },
    bail: true,
    cache: true,
    watch: false,
    debug: true
};


