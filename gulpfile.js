'use strict'

const gulp = require('gulp')
const plumber = require('gulp-plumber')
const rename = require('gulp-rename')
const header = require('gulp-header')
const terser = require('gulp-terser')
const concat = require('gulp-concat')
const sass = require('gulp-sass')
const runSequence = require('run-sequence')
const autoprefixer = require('gulp-autoprefixer')
const livereload = require('gulp-livereload')
const shell = require('gulp-shell')
const clean = require('gulp-clean')
const minifyCSS = require('gulp-minify-css')
const babel = require('gulp-babel')
const sourcemaps = require('gulp-sourcemaps')
const imagemin = require('gulp-imagemin')

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
].join('\n')

gulp.task('scss', () =>
	gulp
	.src(['./scss/**/*.scss'])
	.pipe(plumber())
	.pipe(sass().on('error', sass.logError))
	.pipe(rename('style.css'))
	.pipe(gulp.dest('./'))
)

gulp.task('combineCSS', () =>
	gulp
	.src([
		'./css/vendor.css',
		'./style.css'
	])
	.pipe(minifyCSS())
	.pipe(
		autoprefixer({
			browsers: ['last 2 versions']
		})
	)
	.pipe(concat('style.css'))
	.pipe(header(banner))
	.pipe(gulp.dest('./'))
	.pipe(livereload())
)

/**
 * Task - compileJS
 * compiling all es6 JavaScript syntax with babel
 * save to `complied.js`
 */
gulp.task('compileJS', () => {
	return new Promise((resolve, reject) => {
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
})

/**
 * Task - concatJS
 * Merge all JavaScript files including main - external libs
 * into one file, called 'clients.js'
 */

gulp.task('concatJS', () => {
	return new Promise((resolve, reject) => {
		gulp.src([
				// add more js files here
				'./js/lib.js',
				'./js/compiled.js'
			])
			.pipe(plumber())
			.pipe(
				concat('clients.js', {
					newLine: ';'
				})
			)
			.on('error', reject)
			.pipe(gulp.dest('./js/'))
			.on('end', resolve)
	})
})

/**
 * Task - cleanJS
 * Remove unused file `compiled.js` without read.
 */
gulp.task('cleanCompiledJS', () =>
	gulp
	.src([
		'./js/compiled.js',
		'./js/compiled.js.map'
	], {
		read: false
	})
	.pipe(clean())
)

/**
 * Task - images
 * Compress all image in /img/ folder
 * including png, gif, jpg and svg.
 */
gulp.task('images', () =>
	gulp
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
)

/**
 * Task - Library SCSS
 * Compile vendor scss file into plain CSS file
 *** If you use bootstrap-scss with npm install bootstrap-sass
 *** uncomment this line below to let gulp compile to bootstrap.min.css
 */
gulp.task('libSCSS', () =>
	gulp.src('').pipe(
		shell([
			// 'sass --style=compressed ./node_modules/bootstrap/scss/bootstrap.scss ./css/bootstrap.min.css'
		])
	)
)

/**
 * Task - Library CSS
 * Add your vendor stylesheet files here
 *** eg. bootstrap(from libSCSS task) and magnificpopup
 */
gulp.task('libCSS', () =>
	gulp
	.src([
		// './css/bootstrap.min.css',
		// './node_modules/magnific-popup/dist/magnific-popup.css'
	])
	.pipe(concat('vendor.css'))
	.pipe(gulp.dest('./css/'))
)

/**
 * Task - Library clean
 * remove unused file from another task.
 */
gulp.task('libClean', () =>
	gulp
	.src([
		// './css/bootstrap.min.css', 
		// './css/bootstrap.min.css.map'
	], {
		read: false
	})
	.pipe(clean())
);

/**
 * Task - Concatenate all libraries js files
 * merge them to lib.js
 */
gulp.task('libJSConcat', () =>
	gulp.src([
		// add more js files here
		'./js/vendor/modernizr-3.6.0.min.js',
	])
	.pipe(plumber())
	.pipe(
		concat('lib.js', {
			newLine: ';'
		})
	)
	.pipe(gulp.dest('./js/'))
)

/**
 * Task - Watch php files changed
 * if changed, trigger livereload to reload browser
 */
gulp.task('php', () =>
	gulp.src([''])
	.pipe(livereload())
)

gulp.task('watch', () => {
	livereload.listen({
		start: true
	})
	gulp.watch(['./scss/**/*.scss'], () => runSequence('scss', 'combineCSS'))
	gulp.watch(['./js/main.js'], () => runSequence('compileJS', 'concatJS', 'cleanCompiledJS'))
	gulp.watch(['./**/*.php'], () => runSequence('php'))
})

gulp.task('default', () => runSequence(
	'scss', 'combineCSS', 'compileJS', 'concatJS', 'cleanCompiledJS', 'watch'
))

gulp.task('buildLib', () => runSequence(
	'images', 'libSCSS', 'libCSS', 'libClean', 'libJSConcat'
))
