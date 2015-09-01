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
var CachePlugin = require("webpack/lib/CachePlugin");
var crypto = require('crypto');
var myCache = {};

//require common.js for node_modules (better for server)
var node_modules = fs.readdirSync('node_modules').filter(function(x) { return x !== '.bin' });
function node_externals(context, request, cb) {
    if(node_modules.indexOf(request) !== -1) {
        cb(null, 'commonjs ' + request);
        return;
    }
    cb();
}

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
        new CachePlugin(myCache)
    ],
    resolveLoader: {
        root: __dirname,
        alias: {
            'lift-sass': 'passthru-loader',
            'passthru-loader': path.join(__dirname, 'passthru-loader')
        }
    },
    module: {
        loaders: [
                {
                    test: /\.scss$/,
                    loaders: [
                        'noop-loader'
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
    debug: true,
    externals: [{ 'react/addons' : true, 'newrelic' : true }, node_externals]
};

module.exports = function(moduleSource) {

    if(this.cacheable) this.cacheable();

    var query = loaderUtils.parseQuery(this.query);
    var testString = query.testString || 'scss';
    var re = new RegExp('' + testString + '', 'g');
    var callback = this.async();
    var self = this;
    var fileName = this.resourcePath.split('/').splice(-1)[0];
    var manifest = path.join(query.outputDir, query.manifest);
    var outputStyle = query.outputStyle || 'nested';

    gutil.log('sass-lifter: lifting', gutil.colors.blue(fileName));

    myWebpackConfig.entry = {
        'lift-sass-loader-entry': this.resourcePath
    };

    webpack(myWebpackConfig, function (err, stats) {

        if (err) throw err;

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
                    if (manifest[url]) {
                        source = source.replace(fileRE, path.join(prefix, manifest[url]));
                    }
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

                self.addDependency(foundPaths[j]);

                var result = sass.renderSync({
                    file: foundPaths[j],
                    outputStyle: outputStyle
                });

                if (query.manifest) {
                    //console.log('replacing images', manifest);
                    replaceImages(result.css.toString(), query, function(str){
                        //console.log(str);
                        cssOutput.push(str);
                    });

                } else {
                    cssOutput.push(result.css.toString());
                }
            }

            //create outputs
            var fileOut = cssOutput.join('');
            var hash = crypto.createHash('md5').update(fileOut).digest('hex').substr(0, 8);
            var outputFileNameBasic = fileName.split('.')[0] +'-' + hash + '.css';
            var outputFileName = path.join(query.outputDir, outputFileNameBasic);
            var outputManifestFile = path.join(query.outputDir, 'sass-loader-manifest.json');

            //create current manifest
            var outputManifest = {};
            outputManifest[fileName.split('.')[0]] = outputFileNameBasic;

            //join with previous manifest
            try {
                var readManifest = fs.readFileSync(outputManifestFile, 'utf8');
                outputManifest = _.extend(outputManifest, JSON.parse(readManifest));
                //console.log('output manifest joined', outputManifest);
                try {
                    fs.writeFileSync(outputManifestFile, JSON.stringify(outputManifest), 'utf8');
                } catch (err) {
                    gutil.log('sass-lifter:', gutil.colors.red('error appending manifest'), err);
                }
            } catch (err) {
                gutil.log('sass-lifter:', gutil.colors.blue('manifest not found, creating manifest...'));
                try {
                    fs.writeFileSync(outputManifestFile, JSON.stringify(outputManifest), 'utf8');
                } catch(err) {
                    gutil.log('sass-lifter:', gutil.colors.red('could not create manifest'), err);
                }
            }

            //write css
            fs.writeFile(outputFileName, fileOut, function (err) {
                if (err) {
                    return console.log(err);
                }
                gutil.log('sass-lifter:', gutil.colors.green(outputFileNameBasic), 'was saved');
            });


            callback(null, moduleSource);

        });
    });

};