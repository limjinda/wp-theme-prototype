'use strict';

const gulp = require('gulp');
const plumber = require('gulp-plumber');
const rename = require('gulp-rename');
const header = require('gulp-header');
const uglify = require('gulp-uglify-es').default;
const concat = require('gulp-concat');
const cleanCSS = require('gulp-clean-css');
const sass = require('gulp-sass');
const runSequence = require('run-sequence');
const imagemin = require('gulp-imagemin');
const autoprefixer = require('gulp-autoprefixer');
const livereload = require('gulp-livereload');
const shell = require('gulp-shell');
const concatCSS = require('gulp-concat-css');
const clean = require('gulp-clean');

const banner = [
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
		.pipe(rename('style.css'))
		.pipe(gulp.dest('./'));
});

gulp.task('combine-vendor-style', () => {
	return gulp
		.src([
			'./css/vendor.css',
			'./style.css'
		])
		.pipe(concatCSS('style.css'))
		.pipe(cleanCSS({
			rebaseTo: './',
			level: {
				1: {
					specialComments: 'some',
				}
			}
		}))
		.pipe(header(banner))
		.pipe(gulp.dest('./'))
		.pipe(livereload());
});

gulp.task('javascript', () => {
	return gulp
		.src([
			'./js/vendor/modernizr-3.6.0.min.js', 
			'./js/main.js'
		])
		.pipe(plumber())
		.pipe(
			concat('clients.js', {
				newLine: ';'
			})
		)
		.pipe(
			uglify({
				output: {
					comments: 'some'
				}
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

gulp.task('php', () => {
	return gulp.src([''])
		.pipe(livereload());
})

/**
 * Task - Library SCSS
 * Compile vendor scss file into plain CSS file
 *** If you use bootstrap-scss with npm install bootstrap-sass
 *** uncomment this line below to let gulp compile to bootstrap.min.css
 */
gulp.task('lib-scss', () => {
	return gulp.src('').pipe(
		shell([
			// 'sass --style=compressed ./node_modules/bootstrap/scss/bootstrap.scss ./css/bootstrap.min.css'
		])
	);
});

/**
 * Task - Library CSS
 * Add your vendor stylesheet files here
 *** eg. bootstrap(from lib-scss task) and magnificpopup
 */
gulp.task('lib-css', () => {
	return gulp
		.src([
			// './css/bootstrap.min.css',
			// './node_modules/magnific-popup/dist/magnific-popup.css'
		])
		.pipe(concatCSS('vendor.css'))
		.pipe(gulp.dest('./css/'));
});

/**
 * Task - Library clean
 * remove unused file from another task.
 */
gulp.task('lib-clean', () => {
	return gulp
		.src(['./css/bootstrap.min.css', './css/bootstrap.min.css.map'], {
			read: false
		})
		.pipe(clean());
});

gulp.task('watch', () => {
	livereload.listen({ start: true });
	gulp.watch(['./scss/**/*.scss'], () => runSequence('scss', 'combine-vendor-style'));
	gulp.watch(['./js/main.js'], () => runSequence('javascript'));
	gulp.watch(['./**/*.php'], () => runSequence('php'));
});

gulp.task('default', ['scss', 'combine-vendor-style', 'javascript', 'images', 'watch']);
gulp.task('build-lib-css', () => {
	runSequence('lib-scss', 'lib-css', 'lib-clean');
});

