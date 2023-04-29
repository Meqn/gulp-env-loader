const gulp = require('gulp')
const envInject = require('./libs/index')({ path: './test' })

console.log('env', envInject.env)

function buildJs() {
  return gulp.src('./test/file.js', { sourcemaps: true })
    .pipe(envInject({ isVar: true }))
    .pipe(gulp.dest('./dist', { sourcemaps: '.' }))
}

exports.default = gulp.series(buildJs)
