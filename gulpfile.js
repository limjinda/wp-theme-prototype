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
const imageminPngquant = require('imagemin-pngquant')
const imageminZopfli = require('imagemin-zopfli')
const imageminMozjpeg = require('imagemin-mozjpeg')
const imageminGiflossy = require('imagemin-giflossy')

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

gulp.task('combine-css', () => 
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
gulp.task('compileJS', () => 
	gulp.src('./js/main.js')
		.pipe(babel({
			presets: ['@babel/env']
		}))
		.pipe(gulp.dest('./js/compiled.js'))
)

/**
 * Task - concatJS
 * Merge all JavaScript files including main - external libs
 * into one file, called 'clients.js'
 */

gulp.task('concatJS', () => 
	gulp.src([
		// add more js files here
		'./js/vendor/modernizr-3.6.0.min.js', 
		'./js/compiled.js'
	])
	.pipe(plumber())
	.pipe(
		concat('clients.js', {
			newLine: ';'
		})
	)
	.pipe(sourcemaps.init())
  .pipe(terser({ 
     mangle: false, 
     ecma: 6,
     output: {
     	comments: 'some'
     }
  }))
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest('./js/'))
)

/**
 * Task - cleanJS
 * Remove unused file `compiled.js` without read.
 */
gulp.task('cleanJS', () => 
	gulp.src('./js/compiled.js', {read: false})
		.pipe(clean())
)

/**
 * Task - images
 * Compress all image in /img/ folder
 * including png, gif, jpg, zip and svg.
 */
gulp.task('images', () => 
	gulp
		.src('./img/*')
		.pipe(imagemin([
			imageminPngquant({
				speed: 1,
				quality: [0.95, 1]
			}),
			imageminZopfli({
        more: true
      }),
      imageminGiflossy({
	      optimizationLevel: 3,
	      optimize: 3,
	      lossy: 2
		  }),
		  imagemin.svgo({
        plugins: [{
          removeViewBox: false
        }]
      }),
      imagemin.jpegtran({
      	quality: 80, 
      	progressive: true
      }),
		]))
		.pipe(gulp.dest('./img'))
)

/**
 * Task - Library SCSS
 * Compile vendor scss file into plain CSS file
 *** If you use bootstrap-scss with npm install bootstrap-sass
 *** uncomment this line below to let gulp compile to bootstrap.min.css
 */
gulp.task('lib-scss', () => 
	gulp.src('').pipe(
		shell([
			// 'sass --style=compressed ./node_modules/bootstrap/scss/bootstrap.scss ./css/bootstrap.min.css'
		])
	)
)

/**
 * Task - Library CSS
 * Add your vendor stylesheet files here
 *** eg. bootstrap(from lib-scss task) and magnificpopup
 */
gulp.task('lib-css', () => 
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
gulp.task('lib-clean', () => 
	gulp
		.src([
			'./css/bootstrap.min.css', 
			'./css/bootstrap.min.css.map'
		], {
			read: false
		})
		.pipe(clean())
);

gulp.task('php', () => 
	gulp.src([''])
		.pipe(livereload())
)

gulp.task('watch', () => {
	livereload.listen({ start: true })
	gulp.watch(['./scss/**/*.scss'], () => runSequence('scss', 'combine-css'))
	gulp.watch(['./js/main.js'], () => runSequence('compileJS', 'concatJS', 'cleanJS'))
	gulp.watch(['./**/*.php'], () => runSequence('php'))
})

gulp.task('default', () => runSequence(
	'scss', 'combine-css', 'compileJS', 'concatJS', 'cleanJS', 'images', 'watch'
))

gulp.task('build-lib-css', () => runSequence(
	'lib-scss', 'lib-css', 'lib-clean'
))

