//noop loader for skipping sources
var loaderUtils = require("loader-utils");
var mime = require("mime");

module.exports = function(content) {
    this.cacheable && this.cacheable();
    var query = loaderUtils.parseQuery(this.query);

    //var fileLoader = require("file-loader");
    //return fileLoader.call(this, content);
    return 'module.exports = ""'
};

module.exports.raw = true;