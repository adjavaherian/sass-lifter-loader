var webpack = require('webpack');
var path = require('path');
var fs = require('fs');
var loaderUtils = require("loader-utils");
var SassLifterPlugin = require('./lift-sass-plugin');

var myWebpackConfig = {
    name: 'lift sass webpack',
    target: 'node',
    output: {
        libraryTarget: 'commonjs2',
        path: __dirname,
        filename: 'lift-sass-output.js'
    },
    resolve: {
        root: __dirname,
        fallback: __dirname + '/node_modules',
        modulesDirectories: ['node_modules'],
        extensions: ['', '.json', '.js', '.jsx', '.scss', '.png', '.jpg', '.jpeg', '.gif']
    },
    plugins: [
        new SassLifterPlugin({
            testString: 'scss'
        })
    ],
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

module.exports = function(source) {

    console.log('\nlift-sass loader applying to', this.resourcePath);
    myWebpackConfig.entry = {
        'lift-sass-loader-entry': this.resourcePath
    };

    webpack(myWebpackConfig, function(err, stats) {
        if (err) throw err;
    });

    return source
};