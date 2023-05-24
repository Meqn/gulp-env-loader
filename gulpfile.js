const gulp = require('gulp')
const envInject = require('./libs/index')({ path: './example' })

console.log('env', envInject.env)

function buildJs() {
  return gulp.src('./example/src/file.js', { sourcemaps: true })
    .pipe(envInject({ isVar: true }))
    .pipe(gulp.dest('./example/dest', { sourcemaps: '.' }))
}

exports.default = gulp.series(buildJs)
