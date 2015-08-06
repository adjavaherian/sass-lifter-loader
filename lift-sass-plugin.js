//lift-sass-plugin.js
//lift sass from all dependencies to first entry
//ideally, return a value (cssOutput) to the loader and not write to fs

var _ = require('lodash');
var path = require('path');
var sass = require('node-sass');
var gutil = require('gulp-util');
//var manifest = require('./example/dist/rev-manifest');

//storage for recursive dependencies and output
var visited = {};
var cssOutput = [];

function getNodes(root)  {
    if (root.dependencies) {
        root.dependencies.forEach(function (child) {
            if ( child.module && child.module.userRequest && !visited[child.module.userRequest]) {
                visited[child.module.userRequest] = true;
                getNodes(child.module);
            }
        });
    }
}

function replaceImages(source, options) {

    var manifest = require(options.manifest);
    var urlRE = new RegExp('[\\w.\\/\\-]*(png|gif|jpg|jpeg|svg)', 'gi');
    var urls = source.match(urlRE);

    urls.map(function(url){
        var fileRE = new RegExp(url);
        var prefix = options.prefix || '';
        source = source.replace(fileRE, path.join(prefix, manifest[url]));
        console.log(source);
    });
    return source;
}

function apply(options, compiler) {

    var testString = options.testString || 'scss';
    var re = new RegExp('' + testString + '', 'g');

    //compiler.parser.plugin("var rewire", function (expr) {
    //    console.log('parser expr', expr);
    //    return true;
    //});

    compiler.plugin("compilation", function(compilation, params) {

        compilation.plugin("optimize-chunks", function (chunks) {

            chunks.forEach(function(chunk) {
                gutil.log('lift-sass-plugin entry chunk name', chunk.name);

                var module = chunk.modules[0];
                var moduleRequest =  module.resource;
                gutil.log('lift-sass-plugin working on module', module.resource);
                getNodes(module);

                //get paths for match
                var foundPaths = [];
                _.mapKeys(visited, function(value, key) {
                    if (re.test(key.toString())) {
                        //console.log('scss', key);
                        foundPaths.push(key);
                    }
                });

                for (var i = 0; i < foundPaths.length; i++) {
                    var result = sass.renderSync({
                        file: foundPaths[i]
                    });
                    if (options.manifest && require.resolve(options.manifest)) {
                        cssOutput.push(replaceImages(result.css.toString(), options));
                    } else {
                        cssOutput.push(result.css.toString());
                    }

                }

                this.mainStyle = cssOutput;

            });
        });

    });

}

module.exports = function(options) {
    if (options instanceof Array) {
        options = {
            include: options
        };
    }

    if (!Array.isArray(options.include)) {
        options.include = [ options.include ];
    }

    return {
        apply: apply.bind(this, options)
    };
};