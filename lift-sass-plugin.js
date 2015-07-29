//lift-sass-plugin.js
//lift sass from all dependencies to first entry
//ideally, return a value (cssOutput) to the loader and not write to fs

var _ = require('lodash');
var path = require('path');
var sass = require('node-sass');

//storage for recursive dependencies and output
var visited = {};
var cssOutput = {};

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

function apply(options, compiler) {

    var testString = options.testString || 'scss';
    var re = new RegExp('' + testString + '', 'g');

    compiler.plugin("compilation", function(compilation, params) {

        compilation.plugin("optimize-chunks", function (chunks) {

            chunks.forEach(function(chunk) {
                console.log('\nentry chunk name', chunk.name);

                var module = chunk.modules[0];
                var moduleRequest =  module.resource;
                console.log('lift-sass-plugin working on module', module.resource);
                getNodes(module);

                //get paths for match
                var foundPaths = [];
                _.mapKeys(visited, function(value, key) {
                    if (re.test(key.toString())) {
                        //console.log('scss', key);
                        foundPaths.push(key);
                    }
                });
                cssOutput[moduleRequest] = [];

                for (var i = 0; i < foundPaths.length; i++) {
                    var result = sass.renderSync({
                        file: foundPaths[i]
                    });
                    cssOutput[moduleRequest].push(result.css.toString());
                }

                console.log('cssOutput', cssOutput);

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