/// <binding Clean='clean' />
"use strict";

var gulp = require("gulp"),
    rimraf = require("rimraf"),
    concat = require("gulp-concat"),
    cssmin = require("gulp-cssmin"),
    uglify = require("gulp-uglify");

var webroot = "./wwwroot/";

var paths = {
    js: webroot + "js/**/*.js",
    minJs: webroot + "js/**/*.min.js",
    css: webroot + "css/**/*.css",
    minCss: webroot + "css/**/*.min.css",
    concatJsDest: webroot + "js/site.min.js",
    concatCssDest: webroot + "css/site.min.css",
    npmLibSrc: "./node_modules/",
    npmLibDest: webroot + "lib/npm"
};

gulp.task("clean:npmlib", function (cb) {
    rimraf(paths.npmLibDest, cb);
});


gulp.task("clean:js", function (cb) {
    rimraf(paths.concatJsDest, cb);
});

gulp.task("clean:css", function (cb) {
    rimraf(paths.concatCssDest, cb);
});

gulp.task("clean", ["clean:js", "clean:css", "clean:npmlib"]);

gulp.task("min:js", function () {
    return gulp.src([paths.js, "!" + paths.minJs], { base: "." })
        .pipe(concat(paths.concatJsDest))
        .pipe(uglify())
        .pipe(gulp.dest("."));
});

gulp.task("min:css", function () {
    return gulp.src([paths.css, "!" + paths.minCss])
        .pipe(concat(paths.concatCssDest))
        .pipe(cssmin())
        .pipe(gulp.dest("."));
});

gulp.task("copy:systemjs", function () {
    return gulp.src(paths.npmLibSrc + '/systemjs/dist/**/*.*', { base: paths.npmLibSrc + '/systemjs/dist/' })
         .pipe(gulp.dest(paths.npmLibDest + '/systemjs/dist/'));
});
 
gulp.task("copy:angular2", function () {
    return gulp.src(paths.npmLibSrc + '/@angular/**/*.js', { base: paths.npmLibSrc + '/@angular/' })
         .pipe(gulp.dest(paths.npmLibDest + '/@angular/'));
});
 
gulp.task("copy:core-js", function () {
    return gulp.src(paths.npmLibSrc + '/core-js/**/*min.js', { base: paths.npmLibSrc + '/core-js/' })
         .pipe(gulp.dest(paths.npmLibDest + '/core-js/'));
});
 
gulp.task("copy:rxjs", function () {
    return gulp.src(paths.npmLibSrc + '/rxjs/**/*.js', { base: paths.npmLibSrc + '/rxjs/' })
         .pipe(gulp.dest(paths.npmLibDest + '/rxjs/'));
});

gulp.task("copy:zone.js", function () {
    return gulp.src(paths.npmLibSrc + '/zone.js/dist/*.*', { base: paths.npmLibSrc + '/zone.js/dist/' })
         .pipe(gulp.dest(paths.npmLibDest + '/zone.js/dist/'));
});

gulp.task("copy:angular-in-memory", function () {
    return gulp.src(paths.npmLibSrc + '/angular2-in-memory-web-api/*.js', { base: paths.npmLibSrc + '/angular2-in-memory-web-api/' })
         .pipe(gulp.dest(paths.npmLibDest + '/angular2-in-memory-web-api/'));
});

gulp.task("copy:reflect-metadata", function () {
    return gulp.src(paths.npmLibSrc + '/reflect-metadata/*.*', { base: paths.npmLibSrc + '/reflect-metadata/' })
         .pipe(gulp.dest(paths.npmLibDest + '/reflect-metadata/'));
});

gulp.task('copy-dep', 
    ['copy:rxjs', 
    'copy:angular2', 
    'copy:systemjs', 
    'copy:core-js',
    'copy:zone.js', 
    'copy:reflect-metadata',
    'copy:angular-in-memory']);

gulp.task("min", ["min:js", "min:css"]);

gulp.task("publish", ["min", "copy-dep"]);
