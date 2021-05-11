const project_folder = 'dist';
const source_folder = 'src';

const path = {
   build: {
      html: project_folder + "/",
      css: project_folder + "/css/",
      js: project_folder + "/js/",
      img: project_folder + "/img/",
      fonts: project_folder + "/fonts/",
   },
   src: {
      html: [source_folder + "/*.html", "!" + source_folder + "/_*.html"],
      css: source_folder + "/scss/style.scss",
      js: source_folder + "/js/script.js",
      img: source_folder + "/img/**/*.{jpg,png,svg,gif,ico}",
      fonts: source_folder + "/fonts/*.ttf",
   },
   watch: {
      html: source_folder + "/**/*.html",
      css: source_folder + "/scss/**/*.scss",
      js: source_folder + "/js/**/*.js",
      img: source_folder + "/img/**/*.{jpg,png,svg,gif,ico}",
   },
   clean: "./" + project_folder + "/",
};

const { src, dest } = require('gulp'),
      gulp          = require('gulp'),
      browsersync   = require('browser-sync').create(),
      fileinclude   = require('gulp-file-include'),
      del           = require('del'),
      scss          = require('gulp-sass'),
      autoprefixer  = require('gulp-autoprefixer'),
      group_media   = require('gulp-group-css-media-queries'),
      clean_css     = require('gulp-clean-css'),
      uglify        = require('gulp-uglify-es').default,
      imagemin           = require('gulp-imagemin');

function browserSync() {
   browsersync.init({
      server: {
         baseDir: './' + project_folder + '/'
      },
      port: 3000,
      notify: false
   })
}

function html() {
   return src(path.src.html)
      .pipe(fileinclude())
      .pipe(dest(path.build.html))
      .pipe(browsersync.stream());
}

function fonts() {
   return src(path.src.fonts)
      .pipe(dest(path.build.fonts))
      .pipe(browsersync.stream());
}

function images() {
   return src(path.src.img)
      .pipe(imagemin({
         progressive: true,
         svgoPlugins: [{ removeViewBox: false}],
         interlaced: true,
         optimizationLevel: 3
      }))
      .pipe(dest(path.build.img))
      .pipe(browsersync.stream());
}

function css() {
   return src(path.src.css)
      .pipe(scss({outputStyle: 'expanded'}))
      .pipe(group_media())
      .pipe(autoprefixer({
         overrideBrowserslist: ['last 5 version'],
         cascade: true
      }))
      .pipe(clean_css())
      .pipe(dest(path.build.css))
      .pipe(browsersync.stream())
}

function js() {
   return src(path.src.js)
      .pipe(fileinclude())
      .pipe(uglify())
      .pipe(dest(path.build.js))
      .pipe(browsersync.stream())
}

function watchFiles() {
   gulp.watch([path.watch.html], html);
   gulp.watch([path.watch.css], css);
   gulp.watch([path.watch.js], js);
   gulp.watch([path.watch.img], images);
}

function clean() {
   return del(path.clean);
}

const build = gulp.series(clean, gulp.parallel(js, css, html, images, fonts));
const watch = gulp.parallel(build, watchFiles, browserSync);

exports.html = html;
exports.js = js;
exports.css = css;
exports.images = images;
exports.fonts = fonts;
exports.build = build;
exports.watch = watch;
exports.default = watch;