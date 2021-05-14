'use strict'

const gulp = require('gulp')
const rename = require('gulp-rename')
const header = require('gulp-header')
const terser = require('gulp-terser')
const concat = require('gulp-concat')
const sass = require('gulp-sass')
const autoprefixer = require('gulp-autoprefixer')
const livereload = require('gulp-livereload')
const shell = require('gulp-shell')
const clean = require('gulp-clean')
const cleanCSS = require('gulp-clean-css')
const babel = require('gulp-babel')
const sourcemaps = require('gulp-sourcemaps')
const imagemin = require('gulp-imagemin')

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
].join('\n')

const styles = () => gulp
	.src(['./scss/**/*.scss'])
	.pipe(sass().on('error', sass.logError))
	.pipe(rename('style.css'))
	.pipe(gulp.dest('./'))

/**
 * Task - Vendor Styles
 * Add your vendor stylesheet files here
 *** eg. bootstrap, slider or lightbox
 */
const vendorStyles = () => gulp
	.src([
		// './css/bootstrap.min.css',
		// './node_modules/magnific-popup/dist/magnific-popup.css'
	], {allowEmpty: true})
	.pipe(concat('vendor.css'))
	.pipe(gulp.dest('./css/'))

const concatStyles = () => gulp
	.src([
		'./css/vendor.css',
		'./style.css'
	], {allowEmpty: true})
	.pipe(cleanCSS())
	.pipe(autoprefixer())
	.pipe(concat('style.css'))
	.pipe(header(banner))
	.pipe(gulp.dest('./'))
	.pipe(livereload())


/**
 * Task - scripts
 * compiling all es6 JavaScript syntax with babel
 * save to `complied.js`
 */
const scripts = () => new Promise( (resolve, reject) => {
	gulp.src('./js/main.js')
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
		.pipe(rename('compiled.js'))
		.pipe(sourcemaps.write('.'))
		.on('error', reject)
		.pipe(gulp.dest('./js/'))
		.on('end', resolve)
})

/**
 * Task - Concatenate all vendor's files
 * merge them to lib.js
 */
 const vendorScripts = () => gulp
 .src([
	 // TODO: add more js files here
	 './js/vendor/modernizr-3.6.0.min.js',
 ], {allowEmpty: true})
 .pipe(
	 concat('lib.js', {
		 newLine: ';'
	 })
 )
 .pipe(gulp.dest('./js/'))

/**
 * Task - concatJS
 * Merge all JavaScript files including main - external libs
 * into one file, called 'clients.js'
 */
const concatScripts = () => new Promise((resolve, reject) => {
	gulp.src([
			// add more js files here
			'./js/lib.js',
			'./js/compiled.js'
		], {allowEmpty: true})
		.pipe(
			concat('clients.js', {
				newLine: ';'
			})
		)
		.on('error', reject)
		.pipe(gulp.dest('./js/'))
		.on('end', resolve)
})

/**
 * Task - cleanJS
 * Remove unused file `compiled.js` without read.
 */
const cleanCompiledScripts = () => gulp
	.src([
		'./js/compiled.js',
		'./js/compiled.js.map'
	], { read: false, allowEmpty: true })
	.pipe(clean())


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
		imagemin.jpegtran({
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
	.pipe(gulp.dest('./img'))

/**
 * Task - Watch php files changed
 * if changed, trigger livereload to reload browser
 */

const reloadPHP = () => gulp
	.src([''])
	.pipe(livereload())


const watch = () => {
	livereload.listen({ start: true })
	gulp.watch(['./scss/**/*.scss'], () => gulp.series(
		styles, concatStyles
	))
	gulp.watch(['./js/main.js'], () => gulp.series(
		scripts, 
		concatScripts, 
		cleanCompiledScripts
	))
	gulp.watch(['./**/*.php'], () => reloadPHP)
}

exports.styles = styles
exports.vendorStyles = vendorStyles
exports.concatStyles = concatStyles

exports.scripts = scripts
exports.vendorScripts = vendorScripts
exports.concatScripts = concatScripts
exports.cleanCompiledScripts = cleanCompiledScripts

exports.images = images
exports.reloadPHP = reloadPHP
exports.watch = watch

const vendor = gulp.series(images, vendorStyles, vendorScripts)

const build = gulp.series(
	styles, 
	concatStyles, 
	scripts, 
	concatScripts, 
	cleanCompiledScripts, 
	watch
)

exports.vendor = vendor
exports.build = build

exports.default = build