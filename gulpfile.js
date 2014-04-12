var gulp = require('gulp');
var mochaPhantomJS = require('gulp-mocha-phantomjs');
var watch = require('gulp-watch');
var connect = require('gulp-connect');

gulp.task('test', function() {
  return gulp
  .src('test/runner.html', {read: false})
  .pipe(mochaPhantomJS())
});

gulp.task('connect', function() {
  connect.server({
    root: '.',
    livereload: true,
  });
})

gulp.task('default', ['connect'], function() {
  gulp.watch(['*.js', 'test/**'], ['test']);
});
