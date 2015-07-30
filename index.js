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
        path: path.join('/dev'),
        filename: 'null'
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
                {
                    test: /\.scss$/,
                    loader: 'raw!sass'
                }
                , {
                    test: /\.(jpe?g|png|gif|svg)$/i,
                    loader: 'null-loader'
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
    cache: false,
    debug: true
};

module.exports = function(source) {

    var callback = this.async();

    console.log('\nlift-sass loader applying to', this.resourcePath);

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