# WordPress Theme prototype

![Screenshot](screenshot.png)

with Gulp asset pipeline to automate build, clean and livereload your browser when code changes. Include all of these modern libraries:

<a target='_blank' rel='nofollow' href='https://app.codesponsor.io/link/1aARcky3P9ucy7pzWWZ39kDU/jir4yu/wp-theme-prototype'>
  <img alt='Sponsor' width='888' height='68' src='https://app.codesponsor.io/embed/1aARcky3P9ucy7pzWWZ39kDU/jir4yu/wp-theme-prototype.svg' />
</a>

* Uglify
* Concat
* CleanCSS
* Watch
* Livereload
* Imagemin
* Autoprefixer
* PurifyCSS

that's all enough for frontend developer who want to develop a WordPress theme.

## 👨🏻‍💻 Usage

* Clone this project to your `wp-content/themes` and rename it as you want
* run `npm install`
* open **gulpfile.js** and update your banner string
* run `gulp` and start coding
* for production, don't forget to remove remote repository by `git remote remove origin`

## ⚠️  Header comment

Header comment in style.css is important when you developing WordPress theme. because WordPress will use this comment block to identify what theme is it, who made it, etc.

So if header comment is missing or incorrect, you will not see this theme in Appearance > Themes