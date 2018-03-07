const pkg = require("./package.json")
const gulp = require("gulp")
const pump = require("pump")
const browserify = require("gulp-bro")
const uglify = require("gulp-uglify")
const sass = require("gulp-sass")
const postcss = require("gulp-postcss")
const zip = require("gulp-zip")
const fse = require("fs-extra")
const execa = require("execa")

gulp.task("build:js", () => pump([
  gulp.src("assets/js/**/*.entry.js"),
  browserify({
    transform: [
      require("bubleify"),
      require("uglifyify")
    ]
  }),
  uglify(),
  gulp.dest("build/assets/js/")
]))

gulp.task("build:css", () => pump([
  gulp.src("assets/css/**/*.entry.scss"),
  sass({
    outputStyle: "compressed",
    importer: require("node-sass-package-importer")()
  }).on("error", sass.logError),
  postcss([
    require("autoprefixer")({ browsers: ["last 2 versions", ">5%"] }),
    require("cssnano")()
  ]),
  gulp.dest("build/assets/css/")
]))

gulp.task("build:images", () => pump([
  gulp.src("assets/images/**/*"),
  // Just copy
  gulp.dest("build/assets/images/")
]))

gulp.task("build:templates", () => pump([
  gulp.src("templates/**/*"),
  // Just copy
  gulp.dest("build/")
]))

gulp.task("build:meta", () => {
  const meta = Object.assign({}, pkg)

  delete meta.dependencies
  delete meta.devDependencies
  delete meta.scripts

  return fse.outputJSON("build/package.json", meta)
})

gulp.task("build", gulp.parallel("build:js", "build:css", "build:images", "build:templates", "build:meta"))

gulp.task("package", () => pump([
  gulp.src("build/**/*"),
  zip("" + pkg.name + "-" + pkg.version + ".zip"),
  gulp.dest("dist/")
]))

gulp.task("validate", () => execa("gscan", ["build"], { stdio: "inherit" }))

gulp.task("clean", () => Promise.all(["build", "dist"].map(dir => fse.remove(dir))))

gulp.task("default", gulp.series("clean", "build", gulp.parallel(["package", "validate"])))
