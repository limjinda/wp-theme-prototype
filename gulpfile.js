'use strict';

let gulp = require('gulp');
let plumber = require('gulp-plumber');
let rename = require('gulp-rename');
let header = require('gulp-header');
let uglify = require('gulp-uglify');
let concat = require('gulp-concat');
let cleanCSS = require('gulp-clean-css');
let sass = require('gulp-sass');
let watch = require('gulp-watch');
let runSequence = require('run-sequence');
let imagemin = require('gulp-imagemin');
let autoprefixer = require('gulp-autoprefixer');
let livereload = require('gulp-livereload');
let purify = require('gulp-purifycss');

let banner = [
	'/**',
	'/*!',
	'Theme Name: wp-theme-prototype',
	'Theme URI: http://www.jindatheme.com',
	'Author: JindaTheme',
	'Author URI: https://www.jindatheme.com',
	'Description: Premium responsive WordPress theme for example.com',
	'Version: 1.0',
	'License: GNU General Public License v2 or later',
	'License URI: http://www.gnu.org/licenses/gpl-2.0.html',
	'Tags: responsive',
	'Text Domain: wp-theme-prototype',
	'*/',
	''
].join('\n');

gulp.task('scss', () => {
	return gulp
		.src(['./scss/**/*.scss'])
		.pipe(plumber())
		.pipe(sass().on('error', sass.logError))
		.pipe(
			autoprefixer({
				browsers: ['last 2 versions']
			})
		)
		.pipe(
			cleanCSS({
				keepSpecialComments: 0
			})
		)
		.pipe(rename('style.css'))
		.pipe(
			purify(['./**/*.php'], {
				minify: true,
				info: true
			})
		)
		.pipe(header(banner))
		.pipe(gulp.dest('./'))
		.pipe(livereload());
});

gulp.task('javascript', () => {
	return gulp
		.src(['./js/vendor/modernizr-2.8.3-respond-1.4.2.min.js', './js/main.js'])
		.pipe(plumber())
		.pipe(
			concat('clients.js', {
				newLine: ';'
			})
		)
		.pipe(
			uglify({
				preserveComments: 'license'
			})
		)
		.pipe(gulp.dest('./js/'))
		.pipe(livereload());
});

gulp.task('images', () => {
	return gulp
		.src('./img/*')
		.pipe(
			imagemin({
				progressive: true
			})
		)
		.pipe(gulp.dest('./img'));
});

gulp.task('watch', () => {
	livereload.listen();
	gulp.watch(['./scss/**/*.scss'], () => runSequence('scss'));
	gulp.watch(['./js/main.js'], () => runSequence('javascript'));
});

gulp.task('default', ['scss', 'javascript', 'images', 'watch']);
