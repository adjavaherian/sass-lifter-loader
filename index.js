var webpack = require('webpack');
var path = require('path');
var fs = require('fs');
var loaderUtils = require("loader-utils");
var SassLifterPlugin = require('./lift-sass-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var gutil = require('gulp-util');

var myWebpackConfig = {
    name: 'lift sass webpack',
    target: 'node',
    output: {
        libraryTarget: 'commonjs2',
        path: path.join(__dirname, 'example', 'dist'),
        filename: 'sass-lifter-loader-output'
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
    resolveLoader: {
        root: __dirname,
        alias: {
            'lift-sass': path.join(__dirname),
            //'logger-loader': path.join(__dirname, 'logger-loader'),
            'passthru-loader': path.join(__dirname, 'passthru-loader')
        }
    },
    module: {
        loaders: [
                {
                    test: /\.scss$/,
                    loaders: [
                        'raw',
                        //'css',
                        //'logger-loader',
                        'sass'
                    ]
                }
                , {
                    test: /\.(jpe?g|png|gif|svg)$/i,
                    loaders: [
                        'passthru-loader'
                    ]
                }
                , {
                    test: /\.json$/,
                    loaders: ['json-loader']
                }
                , {
                    test: /\.jsx$/,
                    loaders: ['babel']
                }
            ]
    },
    bail: true,
    cache: true,
    debug: true
};

module.exports = function(source) {

    if(this.cacheable) this.cacheable();

    var callback = this.async();

    gutil.log('lift-sass loader applying to', this.resourcePath);

    myWebpackConfig.entry = {
        'lift-sass-loader-entry': this.resourcePath
    };

    webpack(myWebpackConfig, function (err, stats) {
        if (err) throw err;
        callback(null, ['var style = '+JSON.stringify(this.mainStyle)+';', source].join("\n"));
    });

};

//module.exports.pitch = function(remainingRequest) {
//    console.log('remaining', remainingRequest);
//    return [
//        'module.exports = "";'
//    ].join("\n");
//};