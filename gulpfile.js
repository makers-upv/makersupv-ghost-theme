const pkg = require("./package.json")
const gulp = require("gulp")
const pump = require("pump")
const zip = require("gulp-zip")
const fse = require("fs-extra")

gulp.task("build:js", () => pump([
  gulp.src("assets/js/**/*.entry.js"),
  gulp.dest("build/assets/js/")
]))

gulp.task("build:css", () => pump([
  gulp.src("assets/css/**/*.entry.scss"),
  gulp.dest("build/assets/css/")
]))

gulp.task("build:images", () => pump([
  gulp.src("assets/images/**/*"),
  gulp.dest("build/assets/images/")
]))

gulp.task("build:templates", () => pump([
  gulp.src("templates/**/*"),
  gulp.dest("build/")
]))

gulp.task("build:meta", () => pump([
  gulp.src("package.json"),
  gulp.dest("build/")
]))

gulp.task("build", gulp.parallel("build:js", "build:css", "build:images", "build:templates", "build:meta"))

gulp.task("package", () => pump([
  gulp.src("build/**/*"),
  zip("" + pkg.name + "-" + pkg.version + ".zip"),
  gulp.dest("dist/")
]))

gulp.task("clean", () => Promise.all(["build", "dist"].map(dir => fse.remove(dir))))

gulp.task("default", gulp.series("clean", "build", "package"))
