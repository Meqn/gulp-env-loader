# gulp-env-loader

[ [English](./README.md) | [中文](./README.zh_CN.md) ]

A gulp plugin for loading environment variables and replacing them in file contents.  
It can load environment variables from a specified configuration file or from the default `.env` file.

It uses `dotenv` to load additional environment variables from the following files in your environment directory, and it also statically replaces environment variables that appear in the file.

```
.env                # loaded in all cases
.env.local          # loaded in all cases, but ignored by git
.env.[mode]         # only loaded in specified mode
.env.[mode].local   # only loaded in specified mode, but ignored by git
```


> ignores `.*.local`, so you also need to add it to your project's `.gitignore` file:
```
# local env files
.env.local
.env.*.local
```



## Install

```
npm install -D gulp-env-loader
```

> `Node.js > 12`



## Usage

1. Create a `.env` file in the root directory of your project, or create different `.env` files for different environments, such as `.env.development`, `.env.production`, etc.

```yml
# .env configuration
APP_MODE="development"
APP_API_URL="http://test-api.com"
```

```yml
# .env.production configuration
APP_MODE="production"
APP_API_URL="https://api.com"
```

2. Create `gulpfile.js`
```js
const gulp = require('gulp')
const envInject = require('gulp-env-loader')() //!recommended to put at the beginning and execute immediately

// Output the configured environment variables
console.log('env', envInject.env)

gulp.task('build', function() {
  return gulp.src('./src/*.js', { sourcemaps: true })
    .pipe(envInject())
    .pipe(gulp.dest('./dist', { sourcemaps: '.' }))
})
```

3. You can add the runtime parameter `mode` at runtime, which will automatically load the corresponding environment variable configuration file.

```
gulp build --mode=production
```

4. Output results

Source file: `./src/api.js`
```js
export function userLogin(params) {
  return http.post(`${process.env.APP_API_URL}/user/login`, params)
}
```
Output file: `./dist/api.js`
```js
export function userLogin(params) {
  return http.post(`https://api.com/user/login`, params)
}
```



## API
```ts
require('gulp-env-loader')([config])
```

### config
An optional configuration object or configuration file path.  
If it is a string, it represents the configuration file path. If it is an object, it can contain the following properties:
- `path` - (`string`) Configuration file path, default is `.env`
- `mode` - (`string`) Environment mode name.
- `modekey` - (`string`) Environment mode key name, default is `mode`
- `ignoreProcessEnv` - (`boolean`) Turn off writing to `process.env`


### Return value
```js
envInject([option])
```
Creates a through2 stream for replacing environment variables in file contents.

- `isVar` - (`boolean`) Replaces environment variables with their corresponding string representations (Single quotation marks). Default is `true`.
- `env` - (`object`) Additional Environment Variables. 



## Thanks
* [dotenv](https://www.npmjs.com/package/dotenv)
* [dotenv-expand](https://www.npmjs.com/package/dotenv-expand)
* https://juejin.cn/post/6993224664705138702
