//lift-sass-plugin.js
//lift sass from all dependencies to first entry
//ideally, return a value (cssOutput) to the loader and not write to fs

var _ = require('lodash');
var path = require('path');
var webpack = require('webpack');

function ProgressPlugin(opts) {

    return new webpack.ProgressPlugin(function(progress, message) {
        process.stdout.write('progress ' + Math.floor(progress * 100) + '% ' + message + '\r');
    });

}

module.exports = ProgressPlugin;
