/* eslint-disable no-undef */
'use strict';

const gulp = require('gulp');
const rename = require('gulp-rename');
const header = require('gulp-header');
const terser = require('gulp-terser');
const concat = require('gulp-concat');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const livereload = require('gulp-livereload');
const cleanCSS = require('gulp-clean-css');
const babel = require('gulp-babel');
const sourcemaps = require('gulp-sourcemaps');
const imagemin = require('gulp-imagemin');

const banner = [
	'/**',
	'/*!',
	'Theme Name: wp-theme-prototype',
	'Theme URI: https://www.example.com',
	'Author: Jirayu Limjinda',
	'Author URI: https://www.example.com',
	'Description: Premium responsive WordPress theme for example.com',
	'Version: 1.0',
	'License: GNU General Public License v2 or later',
	'License URI: http://www.gnu.org/licenses/gpl-2.0.html',
	'Tags: grid-layout, custom-menu, featured-images, blog',
	'Text Domain: wpcourse',
	'*/',
	''
].join('\n');

/**
 * Task - styles
 * transform all scss/sass files to style.css
 */
const styles = () => gulp
	.src(['./scss/**/*.scss'])
	.pipe(sourcemaps.init())
	.pipe(sass().on('error', sass.logError))
	.pipe(autoprefixer())
	.pipe(rename('style.css'))
	.pipe(cleanCSS())
	.pipe(header(banner))
	.pipe(sourcemaps.write('.'))
	.pipe(gulp.dest('./'))
	.pipe(livereload());
	
/**
 * Task - scripts
 * compiling all es6 JavaScript syntax with babel
 * save to `complied.js`
 */
const scripts = () => gulp
	.src('./js/main.js')
	.pipe(sourcemaps.init())
	.pipe(babel({
		presets: ['@babel/preset-env']
	}))
	.pipe(terser({
		compress: {
			ecma: 2015
		},
		ecma: 2015,
		output: {
			comments: 'some',
			beautify: false
		}
	}))
	.pipe(rename('complied.js'))
	.pipe(sourcemaps.write('.'))
	.pipe(gulp.dest('./js/'))
	.pipe(livereload());

/**
 * Task - Vendor Styles
 * Add your vendor stylesheet files here
 *** eg. bootstrap, slider or lightbox
 */
 const vendorStyles = () => gulp
 .src([
		// './node_modules/bootstrap/dist/css/bootstrap.min.css'
	], {allowEmpty: true})
 .pipe(concat('vendor.css'))
 .pipe(gulp.dest('./css/vendor'));

/**
 * Task - Concatenate all vendor's files
 * merge them to vendor.js
 */
 const vendorScripts = () => gulp
 .src([
		'./js/vendor/modernizr-3.6.0.min.js', 
		// './node_modules/bootstrap/dist/js/bootstrap.min.js',
	], {allowEmpty: true})
 .pipe(
		concat('vendor.js', {
			newLine: ';'
		})
 )
 .pipe(gulp.dest('./js/vendor'));

/**
 * Task - images
 * Compress all image in /img/ folder
 * including png, gif, jpg and svg.
 */
const images = () => gulp
	.src(['./img/*.{gif,png,jpg,svg}'])
	.pipe(imagemin([
		imagemin.gifsicle({
			interlaced: true,
			optimizationLevel: 3
		}), // maximum compress
		imagemin.mozjpeg({
			quality: 70,
			progressive: true
		}), // 0 = worst, 100 = best
		imagemin.optipng({
			optimizationLevel: 5
		}), // 7 = maxmimum
		imagemin.svgo({
			plugins: [{
				removeViewBox: true
			}, {
				cleanupIDs: false
			}]
		})
	]))
	.pipe(gulp.dest('./img'));

/**
 * Task - Watch php files changed
 * if changed, trigger livereload to reload browser
 */
const reloadPHP = () => gulp
	.src([''])
	.pipe(livereload());

const watch = () => {
	livereload.listen({ start: true });
	gulp.watch(['./scss/**/*.scss'], gulp.series('styles'));
	gulp.watch(['./js/main.js'], gulp.series('scripts'));
	gulp.watch(['./*.php', './**/*.php'], reloadPHP);
};

exports.styles = styles;
exports.vendorStyles = vendorStyles;

exports.scripts = scripts;
exports.vendorScripts = vendorScripts;

exports.images = images;
exports.reloadPHP = reloadPHP;
exports.watch = watch;

const vendor = gulp.series(images, vendorStyles, vendorScripts);
const dev = gulp.series(styles, scripts, watch);

exports.vendor = vendor;
exports.dev = dev;
exports.default = dev;