var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');

var nghtml2js = require('gulp-ng-html2js');
var uglify = require('gulp-uglify');

var pack = require('./package.json');

var paths = {
  sass: ['./scss/**/*.scss'],
  scripts: ['./www/js/**/*.js'],
  templates: ['./www/templates/*.html', './www/js/**/*.html'],
  dist: './www/dist/'
};

gulp.task('default', ['sass']);

gulp.task('sass', function(done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass({
      errLogToConsole: true
    }))
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

gulp.task('scripts', function(done) {
  return gulp.src(paths.templates)
    .pipe(nghtml2js({
      moduleName: 'chattyTemplates',
      prefix: 'js/'
    }))
    .pipe(concat(pack.version+".temp.js"))
    .pipe(gulp.dest(paths.dist))
    .pipe(gulp.src(paths.scripts)
      .pipe(concat(pack.version+'.js'))
      .pipe(gulp.dest(paths.dist))
      .pipe(gulp.src([paths.dist+pack.version+".temp.js", paths.dist+pack.version+".js"])
        .pipe(concat(pack.version+'.min.js'))
        .pipe(uglify({
          mangle: false
        }))
        .pipe(gulp.dest(paths.dist))
      )
    );
});


gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass']);
  gulp.watch(paths.scripts, ['scripts']);
  gulp.watch(paths.templates, ['scripts']);
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});
