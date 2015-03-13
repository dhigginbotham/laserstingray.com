var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
// path prefix
var prefix = 'assets/';
var paths = {
  vendor: [
    prefix + 'src/js/vendor/modernizr.2.7.1.min.js',
    prefix + 'src/js/vendor/jquery.1.11.1.min.js',
    prefix + 'src/js/vendor/bootstrap.3.0.3.min.js'
  ],
  library: [
    prefix + 'src/js/lib/apiServices.js'
  ],
  vendorAdmin: [
    prefix + 'src/js/vendor/summernote.0.5.9.min.js'
  ],
  productionAdmin: [
    prefix + 'build/js/vendor.admin.min.js'
  ],
  productionClient: [
    prefix + 'build/js/vendor.min.js',
    prefix + 'build/js/library.min.js'
  ],
  css: [prefix + 'src/css/**/*.css']
};

gulp.task('library', function() {
  return gulp.src(paths.library)
    .pipe(uglify())
    .pipe(concat('library.min.js'))
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
  gulp.watch(paths.css, ['css']);
  gulp.watch(paths.vendor, ['vendor']);
  gulp.watch(paths.vendorAdmin, ['vendorAdmin']);
  gulp.watch(paths.productionClient, ['productionClient']);
  gulp.watch(paths.productionAdmin, ['productionAdmin']);
});

gulp.task('uber', ['library', 'css', 'vendor', 'vendorAdmin', 'productionClient', 'productionAdmin', 'watch']);