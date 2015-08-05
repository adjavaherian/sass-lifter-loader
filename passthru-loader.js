//passthru loader for skipping sources
var loaderUtils = require("loader-utils");
var mime = require("mime");

module.exports = function(content) {
    this.cacheable && this.cacheable();
    var re = new RegExp('image|svg', 'g');
    var query = loaderUtils.parseQuery(this.query);

    var mimetype = query.mimetype || query.minetype || mime.lookup(this.resourcePath);

    if(mimetype.toString().match(re) !== null) {
        return "module.exports = ''"
    } else {
        return content
    }

};

module.exports.raw = true;