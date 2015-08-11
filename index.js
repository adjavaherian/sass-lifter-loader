//index.js
//sass-lifter-loader
//lift sass from dependencies and write css to fs

var webpack = require('webpack');
var path = require('path');
var fs = require('fs');
var loaderUtils = require("loader-utils");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var gutil = require('gulp-util');
var _ = require('lodash');
var sass = require('node-sass');

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
    plugins: [],
    resolveLoader: {
        root: __dirname,
        alias: {
            'lift-sass': path.join(__dirname),
            'passthru-loader': path.join(__dirname, 'passthru-loader')
        }
    },
    module: {
        loaders: [
                {
                    test: /\.scss$/,
                    loaders: [
                        'raw',
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

module.exports = function(moduleSource) {

    if(this.cacheable) this.cacheable();

    var query = loaderUtils.parseQuery(this.query);
    var testString = query.testString || 'scss';
    var re = new RegExp('' + testString + '', 'g');
    var callback = this.async();
    var fileName = this.resourcePath.split('/').splice(-1)[0];
    var manifest = path.join(query.outputDir, query.manifest);

    gutil.log('lift-sass loader applying to', fileName);

    myWebpackConfig.entry = {
        'lift-sass-loader-entry': this.resourcePath
    };

    webpack(myWebpackConfig, function (err, stats) {

        if (err) throw err;

        var cache = [];
        var data = JSON.stringify(stats, function(key, value) {
            if (typeof value === 'object' && value !== null) {
                if (cache.indexOf(value) !== -1) {
                    // Circular reference found, discard key
                    return;
                }
                // Store value in our collection
                cache.push(value);
            }
            return value;
        });
        cache = null;

        stats.compilation.entries.map(function(entry) {

            var deps = entry.dependencies;
            //storage for recursive dependencies and output
            var visited = {};
            var cssOutput = [];

            function getNodes(root)  {
                //console.log('getNodes', root.userRequest);
                if (root.dependencies.length > 0) {
                    //console.log('has deps');
                    root.dependencies.forEach(function (child) {
                        //console.log('get child nodes');
                        if ( child.module && child.module.userRequest && !visited[child.module.userRequest]) {
                            visited[child.module.userRequest] = true;
                            getNodes(child.module);
                        }
                    });
                } else {
                    //console.log('no deps', root.userRequest);
                    visited[root.userRequest] = true;
                }
            }

            function replaceImages(source, options, cb) {

                var manifest = require(path.join(options.outputDir, options.manifest));
                var urlRE = new RegExp('[\\w.\\/\\-]*(png|gif|jpg|jpeg|svg)', 'gi');
                var urls = source.match(urlRE) || [];

                urls.map(function(url){
                    var fileRE = new RegExp(url);
                    var prefix = options.prefix || '';
                    source = source.replace(fileRE, path.join(prefix, manifest[url]));
                    //console.log(source);
                });
                cb(source);
            }


            for (var i = 0; i < deps.length; i++) {
                //console.log('depsi', deps[i].userRequest);
                if (deps[i].userRequest) {
                    //console.log('deps.........', deps[i].module.userRequest);
                    getNodes(deps[i].module);
                }
            }

            //get paths for match
            var foundPaths = [];
            _.mapKeys(visited, function (value, key) {
                if (re.test(key.toString())) {
                    //console.log('scss', key);
                    foundPaths.push(key);
                }
            });

            for (var j = 0; j < foundPaths.length; j++) {
                var result = sass.renderSync({
                    file: foundPaths[j]
                });

                if (query.manifest && require.resolve(manifest)) {
                    //console.log('replacing images', manifest);
                    replaceImages(result.css.toString(), query, function(str){
                        //console.log(str);
                        cssOutput.push(str);
                    });

                } else {
                    cssOutput.push(result.css.toString());
                }
            }

            fs.writeFile(path.join(query.outputDir, fileName + '.css'), cssOutput.join(''), function (err) {
                if (err) {
                    return console.log(err);
                }
                console.log(path.join(query.outputDir, fileName + '.css'), " was saved.");
            });

            //fs.writeFile(path.join(query.outputDir, fileName + '.stats.json'), data, function (err) {
            //    if (err) {
            //        return console.log(err);
            //    }
            //    console.log(path.join(query.outputDir, fileName + '.stats.json'), " was saved.");
            //});

            callback(null, moduleSource);

        });
    });


};

//module.exports.pitch = function(remainingRequest) {
//    console.log('remaining', remainingRequest);
//    return [
//        'module.exports = "";'
//    ].join("\n");
//};