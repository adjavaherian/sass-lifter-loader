# webpack-sass-lifter-loader
A Webpack loader and plugin that recursively lifts sass dependencies into the entry point. 

Pretty much done, but needs testing and perhaps performance tweaking.  

`npm i sass-lifter-loader --save-dev`

I add it to webpack like this

```javascript
    resolveLoader: {
        root: __dirname,
        alias: {
            'lift-sass': path.join(__dirname) + '?outputStyle=compressed&testString=scss&prefix=images&manifest=rev-manifest&outputDir=' + path.join(__dirname, 'example', 'dist')
        }
    },
```

Where `lift-sass` is the alias and the params are query style (all params listed above)

Not really sure off the top of my head what happens without params (should work, but needs tests)

Any help would be greatly appreciated.  Thanks.

`npm install && npm start`