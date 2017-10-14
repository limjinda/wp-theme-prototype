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

gulp.task('default', ['scss', 'javascript', 'images', 'watch']);