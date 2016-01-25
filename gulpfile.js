'use strict';

var gulp = require('gulp'),
    sass = require('gulp-sass'),
    del = require('del'),
    browserSync = require('browser-sync'),
    nodemon = require('gulp-nodemon'),
    gulputil = require('gulp-util'),
    imagemin = require('gulp-imagemin'),
    source = require('vinyl-source-stream'),
    sourcemaps = require('gulp-sourcemaps'),
    browserify = require('browserify'),
    streamify = require('gulp-streamify'),
    buffer = require('vinyl-buffer'),
    autoprefixer = require('gulp-autoprefixer'),
    merge = require('merge-stream'),
    jshint = require('gulp-jshint'),
    mocha = require('gulp-mocha'),
    uglify = require('gulp-uglify');

//Path Settings
var pathConfig = {

    scripts: {
      src: './src/scripts/**/*.js',
      dest: './dist/src/',
      bundled_output : 'bundle.js'
    },

    images: {
      src: './src/assets/images/**/*.{jpeg,jpg,png,gif}',
      dest: './dist/images/'
    },

    styles: {
      src: './src/styles/main.scss',
      dest: './dist/css/'
    },

    fonts: {
      src: './src/assets/fonts/**/*',
      dest: './dist/fonts/'
    },

    index_html: {
      src: './src/index.html',
      dest: './dist/'
    },

    src_dir: './src',

    build_dir: './dist',

    //Mocha Test files
    test_dir: ['test/unit/*.js'],

    browserify_entry_point: ['src/scripts/app.js']
};

//Bower Path Settings
var bowerConfig = {
  bootstrap_dir: './bower_components/bootstrap-sass',
  public_dir: pathConfig.build_dir
};

//Express Server Path Settings
var serverConfig = {
  baseScript: './server/express.js',
  proxyHost: 'http://localhost',
  port: 8080
};

gulp.task('clean',function() {
    return del([pathConfig.build_dir]);
});

gulp.task('sass', function() {
    return gulp.src(pathConfig.styles.src)
      .pipe(sourcemaps.init())
      .pipe(sass({
        includePaths: [bowerConfig.bootstrap_dir + '/assets/stylesheets']
      }))
      .on('error', handleErrors)
      .pipe(autoprefixer('last 2 versions', '> 1%', 'ie 8'))
      .pipe(sourcemaps.write())
      .pipe(gulp.dest(pathConfig.styles.dest));
});

gulp.task('lint',function() {
    return gulp.src([pathConfig.scripts.src])
      .pipe(jshint())
      .pipe(jshint.reporter('default'));
});

/**
  TODO: Task not setup yet.  Useful when you use different template engine
  technology when rendering them on angular.
 */
/*
gulp.task('views',function() {
    var viewIndexFile = gulp.src('view_index_file')
      .pipe(gulp.dest('folder'));

    var views = gulp.src('view_files')
      .pipe(templateCache({standalone: true}))
      .pipe(gulp.dest('view_files_dest'));

    return merge(viewIndexFile, views);
});*/

gulp.task('watch', function () {
  gulp.watch(pathConfig.index_html.src, ['copyIndex']);

  gulp.watch(pathConfig.scripts.src, ['lint', 'browserify']);

  gulp.watch(pathConfig.styles.src, ['sass']);

  gulp.watch(pathConfig.images.src, ['copyImages']);

  gulp.watch(pathConfig.fonts.src,['copyFonts'])

})

gulp.task('copyFonts', function () {
  return gulp.src(bowerConfig.bootstrap_dir + '/assets/fonts/**/*')
    .pipe(gulp.dest(bowerConfig.public_dir + '/fonts'));
});

gulp.task('copyImages',function() {
  return gulp.src(pathConfig.images.src)
    .pipe(imagemin())
    .pipe(gulp.dest(pathConfig.images.dest));
});

gulp.task('browserSync',['nodemon'], function() {
    browserSync.init(null, {
          proxy: "http://localhost:5000",
          files:["dist/**/*.*"],
          port: 7000,
    });
});

gulp.task('browserify', ['lint'], function () {
  return browserify({
      entries: pathConfig.browserify_entry_point,
      debug: true,
      cache: {},
      packageCache: {},
      fullPaths: true
    }).bundle()
      .on('error', handleErrors)
      .pipe(source(pathConfig.scripts.bundled_output))
      .pipe(buffer())
      .pipe(sourcemaps.init({loadMaps: true}))
      .pipe(streamify(uglify()))
      .pipe(sourcemaps.write())
      .pipe(gulp.dest('dist/src'));
} );

gulp.task('build',['lint'], function () {
  return browserify({
      entries: pathConfig.browserify_entry_point,
      cache: {},
      packageCache: {},
    }).bundle()
      .on('error', handleErrors)
      .pipe(source(pathConfig.scripts.bundled_output))
      .pipe(buffer())
      .pipe(sourcemaps.init({loadMaps: true}))
      .pipe(streamify(uglify()))
      .pipe(sourcemaps.write())
      .pipe(gulp.dest('dist/src'));
} );

gulp.task('nodemon', function(cb) {
    var started = false;

    return nodemon({
        script: serverConfig.baseScript
    }).on('start', function () {
        if(!started){
            cb();
            started = true;
        }
    })
});

gulp.task('copyIndex', function () {
  gulp.src(pathConfig.index_html.src)
    .pipe(gulp.dest(pathConfig.index_html.dest));
})

//Unit Testing Tasks
gulp.task('mochaTestUnit',function() {
  return gulp.src(pathConfig.test_dir, { read: false })
    .pipe(mocha({reporter: 'spec'}))
    .on('error', exitProcess);
});

gulp.task('dev', ['sass', 'copyFonts', 'copyImages', 'copyIndex', 'browserify', 'browserSync', 'watch']);

gulp.task('prod', ['sass', 'copyFonts', 'copyImages', 'copyIndex', 'build']);

gulp.task('test', ['mochaTestUnit']);

//Callback Functions
function handleErrors (err) {
  console.log(err.toString());
  this.emit('end');
};
//A bug fix for gulp mocha plugin
function exitProcess(){
  process.exit(1);
};
