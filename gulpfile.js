var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');

// path prefix
var prefix = 'assets/';
var vendorPrefix = prefix + 'src/vendor/';

var paths = {
  vendor: [
    vendorPrefix + 'modernizr/modernizr.js',
    vendorPrefix + 'jquery/jquery.min.js'
  ],
  library: [
    prefix + 'src/js/utils/global.js',
    vendorPrefix + 'murk/dist/murk.js'
  ],
  libraryAdmin: [
  ],
  vendorAdmin: [
  ],
  productionAdmin: [
  ],
  productionClient: [
    prefix + 'build/js/vendor.min.js',
    prefix + 'build/js/library.min.js'
  ],
  css: [
    vendorPrefix + 'baseless/dist/style.min.css'
  ]
};

gulp.task('library', function() {
  return gulp.src(paths.library)
    .pipe(uglify())
    .pipe(concat('library.min.js'))
    .pipe(gulp.dest(prefix + 'build/js'));
});

gulp.task('libraryAdmin', function() {
  return gulp.src(paths.libraryAdmin)
    .pipe(uglify())
    .pipe(concat('library.admin.min.js'))
    .pipe(gulp.dest(prefix + 'build/js'));
});

gulp.task('vendor', function() {
  return gulp.src(paths.vendor)
    .pipe(uglify())
    .pipe(concat('vendor.min.js'))
    .pipe(gulp.dest(prefix + 'build/js'));
});

gulp.task('vendorAdmin', function() {
  return gulp.src(paths.vendorAdmin)
    .pipe(uglify())
    .pipe(concat('vendor.admin.min.js'))
    .pipe(gulp.dest(prefix + 'build/js'));
});

gulp.task('css', function () {
  return gulp.src(paths.css)
    .pipe(concat('style.min.css'))
    .pipe(gulp.dest(prefix + 'build/css'));
});

gulp.task('productionClient', function() {
  return gulp.src(paths.productionClient)
    .pipe(concat('client.min.js'))
    .pipe(gulp.dest(prefix + 'build/js'));
});

gulp.task('productionAdmin', function() {
  return gulp.src(paths.productionAdmin)
    .pipe(concat('admin.min.js'))
    .pipe(gulp.dest(prefix + 'build/js'));
});

gulp.task('watch', function() {
  gulp.watch(paths.library, ['library']);
  // gulp.watch(paths.libraryAdmin, ['libraryAdmin']);
  gulp.watch(paths.css, ['css']);
  gulp.watch(paths.vendor, ['vendor']);
  // gulp.watch(paths.vendorAdmin, ['vendorAdmin']);
  // gulp.watch(paths.productionClient, ['productionClient']);
  // gulp.watch(paths.productionAdmin, ['productionAdmin']);
});

var uberTasks = [];
uberTasks.push('library');
// uberTasks.push('libraryAdmin');
uberTasks.push('css');
uberTasks.push('vendor');
// uberTasks.push('vendorAdmin');
// uberTasks.push('productionClient');
// uberTasks.push('productionAdmin');
uberTasks.push('watch');

gulp.task('uber', uberTasks);