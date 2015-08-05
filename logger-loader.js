var webpack = require('webpack');
var path = require('path');
var fs = require('fs');
var loaderUtils = require("loader-utils");
var SassLifterPlugin = require('./lift-sass-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var gutil = require('gulp-util');
var gulp = require('gulp');

var re = new RegExp('[\\w.\\/\\-]*(png|gif|jpg|jpeg|svg)', 'gi');

module.exports = function(source) {

    if(this.cacheable) this.cacheable();

    var callback = this.async();

    var urls = source.match(re);

    urls.map(function(url){
       console.log('url', url);
    });

    gutil.log('logger loader applying to', this.resourcePath, urls);

    //var cssAsString = JSON.stringify(result.source);



    callback(null, source);

};

//module.exports.pitch = function(remainingRequest) {
//    console.log('remaining', remainingRequest);
//    return [
//        'module.exports = "";'
//    ].join("\n");
//};
