import execa from "execa"
import fse from "fs-extra"
import gulp from "gulp"
import browserify from "gulp-bro"
import postcss from "gulp-postcss"
import sass from "gulp-sass"
import uglify from "gulp-uglify"
import zip from "gulp-zip"
import pump from "pump"
import pkg from "./package.json"

export const build_js = () =>
  pump([
    gulp.src("assets/js/**/*.entry.js"),
    browserify({
      transform: [
        [require("bubleify"), { transforms: { dangerousForOf: true } }],
        require("uglifyify")
      ]
    }),
    uglify(),
    gulp.dest("build/assets/js/")
  ])
export const watch_js = () => gulp.watch("assets/js/**/*", build_js)

export const build_css = () =>
  pump([
    gulp.src("assets/css/**/*.entry.scss"),
    sass({
      outputStyle: "compressed",
      importer: require("node-sass-package-importer")()
    }).on("error", sass.logError),
    postcss([require("autoprefixer")(), require("cssnano")()]),
    gulp.dest("build/assets/css/")
  ])
export const watch_css = () => gulp.watch("assets/css/**/*", build_css)

export const build_images = () =>
  pump([
    gulp.src("assets/images/**/*"),
    // Just copy
    gulp.dest("build/assets/images/")
  ])
export const watch_images = () => gulp.watch("assets/images/**/*", build_images)

export const build_templates = () =>
  pump([
    gulp.src("templates/**/*"),
    // Just copy
    gulp.dest("build/")
  ])
export const watch_templates = () =>
  gulp.watch("templates/**/*", build_templates)

export const build_meta = async () => {
  const meta = { ...pkg }

  delete meta.dependencies
  delete meta.devDependencies
  delete meta.scripts

  await fse.outputJSON("build/package.json", meta)
}
export const watch_meta = () => gulp.watch("package.json", build_meta)

export const build = gulp.parallel(
  build_js,
  build_css,
  build_images,
  build_templates,
  build_meta
)
export const watch = gulp.parallel(
  watch_js,
  watch_css,
  watch_images,
  watch_templates,
  watch_meta
)

export const pack = () =>
  pump([
    gulp.src("build/**/*"),
    zip(`${pkg.name}-${pkg.version}.zip`),
    gulp.dest("dist/")
  ])

export const validate = async () =>
  await execa("gscan", ["build"], { stdio: "inherit" })
const silent_validate = async () => {
  try {
    await validate()
  } catch (_) {}
}
export const watch_validate = () => gulp.watch("build/**/*", silent_validate)

export const clean = async () =>
  await Promise.all([fse.remove("build"), fse.remove("dist")])

export default gulp.series(clean, build, gulp.parallel(pack, validate))
export const dev = gulp.series(
  clean,
  build,
  silent_validate,
  gulp.parallel(watch, watch_validate)
)
