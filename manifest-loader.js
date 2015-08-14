//manifest loader for replacing rev'd sources
var loaderUtils = require('loader-utils');
var path = require('path');
var gutil = require('gulp-util');

module.exports = function(content) {

    this.cacheable && this.cacheable();
    var callback = this.async();

    var options = loaderUtils.parseQuery(this.query);
    var manifest = require(path.join(options.outputDir, options.manifest));
    var fileName = this.resourcePath.split('/').splice(-1)[0];
    var prefix = options.prefix || '';

    gutil.log('webpack manifest loader', fileName, ' > ', path.join(prefix, manifest[fileName]));
    callback(null, 'module.exports = "' + path.join(prefix, manifest[fileName]) + '"');

};

module.exports.raw = true;