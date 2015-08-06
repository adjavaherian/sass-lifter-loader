var gulp = require('gulp');
var webpack = require('webpack-stream');
var path = require('path');
var runSequence = require('run-sequence');
var imagemin   = require('gulp-imagemin');
var debug      = require('gulp-debug');
var rev             = require('gulp-rev');
var del = require('del');

gulp.task('default', function(callback) {
    runSequence(
        'clean',
        'images',
        'webpack',
        callback);
});

gulp.task('clean', function(callback) {
    del('example/dist/*');
    callback();
});

gulp.task('images', function() {
    return gulp.src('example/images/**/*.+(jpg|jpeg|ico|png|gif|svg)')
        .pipe(debug({title: 'optimizing'}))
        .pipe(imagemin()) // Optimize
        .pipe(rev())
        .pipe(gulp.dest('example/dist/images'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('example/dist'));
});

gulp.task('webpack', function() {
    return gulp.src(path.join(__dirname, 'example', 'App.jsx'))
        .pipe(webpack( require('./webpack.config.js') ))
        .pipe(gulp.dest(path.join(__dirname, 'example', 'dist')));
});