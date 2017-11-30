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

/**
 * Task - Library SCSS
 * Compile vendor scss file into plain CSS file
 *** If you use bootstrap-scss with npm install bootstrap-sass
 *** uncomment this line below to let gulp compile to bootstrap.min.css
 */
gulp.task('lib-scss', () => {
	return gulp.src('').pipe(
		shell([
			// 'sass --scss -t compressed ./node_modules/bootstrap-sass/assets/stylesheets/_bootstrap.scss ./css/bootstrap.min.css'
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
		.pipe(
			cleanCSS({
				keepSpecialComments: 0
			})
		)
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
	livereload.listen();
	gulp.watch(['./scss/**/*.scss'], () => runSequence('scss'));
	gulp.watch(['./js/main.js'], () => runSequence('javascript'));
});

gulp.task('default', ['scss', 'javascript', 'images', 'watch']);
gulp.task('build-lib-css', () => {
	runSequence('lib-scss', 'lib-css', 'lib-clean');
});

