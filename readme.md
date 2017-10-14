# WordPress Theme prototype

with Gulp asset pipeline to automate build, clean and livereload your browser when code changes. Include all of these modern libraries:

* Uglify
* Concat
* CleanCSS
* Imagemin
* Autoprefixer
* PurifyCSS

that's all enough for frontend developer who want to develop a WordPress theme.

## 👨🏻‍💻 Usage

* Clone this project to your `wp-content/themes` and rename it as you want
* run `npm install` or `yarn install`
* open **gulpfile.js** and change banner string to yours

## ⚠️  Header comment

Header comment in style.css is important when you developing WordPress theme. because WordPress will use this comment block to identify what theme is it, who made it, etc.

So if header comment is missing or incorrect, you will not see this theme in Appearance > Themes