/// <binding AfterBuild='min' Clean='clean' />
/// <binding After Build='min' />

'use strict';

var gulp = require('gulp'),
    rimraf = require('gulp-rimraf'),
    concat = require('gulp-concat'),
    cssmin = require('gulp-minify-css'),
    ts = require('gulp-typescript'),
    ignore = require('gulp-ignore'),
    uglify = require('gulp-uglify'),
    scss = require('gulp-sass');

var webroot = './wwwroot/';

var paths = {
    ts: [webroot + 'app/**/*.ts', '!./**/node_modules/**/*.*'],
    tsTemplates: [webroot + 'app/**/*.html', webroot + 'app/**/*.css'],
    js: webroot + 'app/**/*.js',
    jsMap: webroot + 'app/**/*.js.map',
    css: webroot + 'css/**/*.css',
    minCss: webroot + 'css/**/*.min.css',
    concatCssDest: webroot + 'css/site.min.css',
    npmLibSrc: './node_modules/',
    npmLibDest: webroot + 'lib/npm',
    appSass: webroot + 'app/**/*.scss'
};

gulp.task('clean:npmlib', function(cb) {
    return gulp.src([paths.npmLibDest], {
            read: false
        })
        .pipe(rimraf());
});

gulp.task('clean:js', function(cb) {
    return gulp.src([paths.js], {
            read: false
        })
        .pipe(rimraf());
});

gulp.task('clean:jsmap', function(cb) {
    return gulp.src([paths.jsMap], {
            read: false
        })
        .pipe(rimraf());
});

gulp.task('clean:css', function(cb) {
    rimraf(paths.concatCssDest, cb);
});

gulp.task('clean', ['clean:js', 'clean:jsmap', 'clean:css', 'clean:npmlib']);

gulp.task('copy:jasmine', function() {
    return gulp.src(paths.npmLibSrc + '/jasmine-core/lib/**/*.*', {
            base: paths.npmLibSrc + '/jasmine-core/'
        })
        .pipe(gulp.dest(paths.npmLibDest + '/jasmine-core/'));
});

gulp.task('copy:systemjs', function() {
    return gulp.src(paths.npmLibSrc + '/systemjs/dist/**/*.*', {
            base: paths.npmLibSrc + '/systemjs/dist/'
        })
        .pipe(gulp.dest(paths.npmLibDest + '/systemjs/dist/'));
});

gulp.task('copy:angular2', function() {
    return gulp.src(paths.npmLibSrc + '/@angular/**/*.js', {
            base: paths.npmLibSrc + '/@angular/'
        })
        .pipe(gulp.dest(paths.npmLibDest + '/@angular/'));
});

gulp.task('copy:core-js', function() {
    return gulp.src(paths.npmLibSrc + '/core-js/**/*min.js', {
            base: paths.npmLibSrc + '/core-js/'
        })
        .pipe(gulp.dest(paths.npmLibDest + '/core-js/'));
});

gulp.task('copy:rxjs', function() {
    return gulp.src(paths.npmLibSrc + '/rxjs/**/*.js', {
            base: paths.npmLibSrc + '/rxjs/'
        })
        .pipe(gulp.dest(paths.npmLibDest + '/rxjs/'));
});

gulp.task('copy:zone.js', function() {
    return gulp.src(paths.npmLibSrc + '/zone.js/dist/*.*', {
            base: paths.npmLibSrc + '/zone.js/dist/'
        })
        .pipe(gulp.dest(paths.npmLibDest + '/zone.js/dist/'));
});

gulp.task('copy:angular-in-memory', function() {
    return gulp.src(paths.npmLibSrc + '/angular2-in-memory-web-api/*.js', {
            base: paths.npmLibSrc + '/angular2-in-memory-web-api/'
        })
        .pipe(gulp.dest(paths.npmLibDest + '/angular2-in-memory-web-api/'));
});

gulp.task('copy:reflect-metadata', function() {
    return gulp.src(paths.npmLibSrc + '/reflect-metadata/*.*', {
            base: paths.npmLibSrc + '/reflect-metadata/'
        })
        .pipe(ignore.include('**/*.js'))
        .pipe(gulp.dest(paths.npmLibDest + '/reflect-metadata/'));
});

gulp.task('copy-dep', ['copy:rxjs',
    'copy:angular2',
    'copy:systemjs',
    'copy:core-js',
    'copy:zone.js',
    'copy:reflect-metadata',
    'copy:angular-in-memory',
    'copy:jasmine'
], function(cb) {
    cb();
});

gulp.task('min:css', function() {
    return gulp.src([paths.css, '!' + paths.minCss])
        .pipe(concat(paths.concatCssDest))
        .pipe(cssmin())
        .pipe(gulp.dest('.'));
});

var tsProject = ts.createProject('tsconfig.json');

gulp.task('ts', function() {
    var tsResult = tsProject.src(paths.ts) // load all files from our pathspecification
        .pipe(ts(tsProject)); // transpile the files into .js
    
    return tsResult.js.pipe(gulp.dest('./wwwroot/app')); // save the .js in the same place as the original .ts-file
});

gulp.task('sass', function() {
    gulp.src(paths.appSass)
        .pipe(scss().on('error', scss.logError)) // this will prevent our future watch-task from crashing on sass-errors
        .pipe(cssmin({
            compatibility: 'ie8'
        })) // see the gulp-sass doc for more information on compatibilitymodes
        .pipe(gulp.dest(function(file) {
            return file.base; // because of Angular 2's encapsulation, it's natural to save the css where the scss-file was
        }));
});

gulp.task('min', ['min:css', 'copy-dep']);

gulp.task('watch', ['ts', 'sass'], function() { // brackets makes sure we run ts and sass once before the watch starts
    gulp.watch(paths.tsTemplates, ['ts'])
    gulp.watch(paths.ts, ['ts']); // run the ts-task any time stuff in appJavascript changes
    gulp.watch(paths.appSass, ['sass']); // run the sass-task any time stuff in the appScss changes
});