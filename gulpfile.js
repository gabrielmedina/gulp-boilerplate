// gulpfile

let gulp            = require('gulp'),
    concat          = require('gulp-concat'),
    sass            = require('gulp-sass'),
    uglify          = require('gulp-uglify'),
    nunjucksRender  = require('gulp-nunjucks-render'),
    htmlmin         = require('gulp-htmlmin'),
    deploygh        = require('gulp-gh-pages'),
    injectSvg       = require('gulp-inject-svg'),
    include         = require('gulp-include'),
    clean           = require('gulp-clean'),
    browserSync     = require('browser-sync');

gulp.task('production', ['clear'], function() {
  gulp
    .src('./dist/**/*')
    .pipe(deploygh({
      remoteUrl: 'git@github.com:gabrielmedina/gulp-boilerplate.git',
      branch: 'production'
    }));
});

gulp.task('develop', ['clear'], function() {
  gulp
    .src('./dist/**/*')
    .pipe(deploygh({
      remoteUrl: 'git@github.com:gabrielmedina/gulp-boilerplate.git',
      branch: 'develop'
    }));
});

gulp.task('clear', function () {
  return gulp.src('.publish', {read: false})
    .pipe(clean());
});

gulp.task('css', function() {
  gulp
    .src('app/assets/css/*.scss')
    .pipe(sass({outputStyle: 'compressed'}))
    .pipe(gulp.dest('dist/css'))
});

gulp.task('js', function() {
  gulp
    .src('app/assets/js/*.js')
    .pipe(include())
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'))
});

gulp.task('html', function() {
  gulp
    .src('app/views/pages/**/*.+(html|nunjucks)')
    .pipe(nunjucksRender({
      path: ['app/views']
    }))
    .pipe(injectSvg({ base: '/app/assets' }))
    .pipe(htmlmin({
      collapseWhitespace: true
    }))
    .pipe(gulp.dest('dist'))
});

gulp.task('img', function() {
  gulp
    .src('app/assets/img/**/*')
    .pipe(gulp.dest('dist/img'));
});

gulp.task('browser-sync', function() {
  browserSync
    .init({
      server: {
        baseDir: 'dist'
      }
    })
});

let reload  = browserSync.reload;

gulp.task('default', ['browser-sync', 'css', 'js', 'img', 'html'], function() {
  gulp.watch('app/assets/img/**/*', ['img']).on('change', reload);
  gulp.watch('app/assets/css/**/*', ['css']).on('change', reload);
  gulp.watch('app/assets/js/**/*', ['js']).on('change', reload);
  gulp.watch('app/views/**/*', ['html']).on('change', reload);
});
