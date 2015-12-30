var gulp = require('gulp');
var css = require('gulp-mini-css');
var minify = require('gulp-minify');
var jshint = require('gulp-jshint');
var minifyHtml = require("gulp-minify-html");
var clean = require('gulp-clean');
var connect = require('gulp-connect');
var root = process.cwd();

gulp.task('server', function () {
  connect.server({
    port: 5555,
    livereload: true
  });
});

gulp.task('livereload', function() {
  gulp.src(['css/*.css','*.html'])
    .pipe(connect.reload());
});

gulp.task("mini-js", function () {
	return gulp.src(['js/*.js'])
	.pipe(minify())
	.pipe(gulp.dest("build/js"));
})
gulp.task('mini-css', function () {
	return gulp.src('css/*.css')
	.pipe(css({
			ext : '-min.css'
		}))
	.pipe(gulp.dest("build/css"));
});

gulp.task('copy-html', function () {
	gulp.src('*.html') // 要压缩的html文件
	.pipe(minifyHtml()) //压缩
	.pipe(gulp.dest("build"));
});

gulp.task('copy-img', function () {
	return gulp.src('img/**')
	.pipe(gulp.dest("build/img"));
});

gulp.task('clean', function () {
	return gulp.src([dest + '/*'], {
		read : false
	})
	.pipe(clean());
});

gulp.task('lint', function () {
	return gulp.src(['js/*.js','!js/*min.js'])
	.pipe(jshint())
	.pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('watch', function () {
	gulp.watch('js/*.js', ['lint']);
	gulp.watch(['css/*.css','*.html'], ['livereload']);
	
});

gulp.task('default', ['lint', 'watch', "server"]);

gulp.task('build', ['mini-js','mini-css','copy-html', 'copy-img']);

