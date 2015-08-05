var gulp = require('gulp');
var webpack = require('webpack-stream');
var path = require('path');

gulp.task('default', function() {
    return gulp.src(path.join(__dirname, 'example', 'App.jsx'))
        .pipe(webpack( require('./webpack.config.js') ))
        .pipe(gulp.dest(path.join(__dirname, 'example', 'dist')));
});