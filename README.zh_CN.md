# gulp-env-loader

[ [English](./README.md) | [中文](./README.zh_CN.md) ]

一个用于加载环境变量并替换文件内容中的环境变量的 gulp 插件。  
它可以从指定的配置文件中加载环境变量，也可以从默认的 `.env` 文件中加载环境变量。

它使用 `dotenv` 从你的 环境目录 中的下列文件加载额外的环境变量，并且它还将静态替换出现在文件内的环境变量。

```
.env                # 所有情况下都会加载
.env.local          # 所有情况下都会加载，但会被 git 忽略
.env.[mode]         # 只在指定模式下加载
.env.[mode].local   # 只在指定模式下加载，但会被 git 忽略
```


> git忽略 `.*.local`，还需要在项目的 `.gitignore` 文件中添加
```
# local env files
.env.local
.env.*.local
```



## Install

```
npm install -D gulp-env-loader
```

> `Node.js > 14`




## Usage

1. 在项目根目录下创建 `.env` 文件，也可以根据不同的环境创建不同的 `.env` 文件，比如 `.env.development`, `.env.production` 等。

```yml
# .env 文件配置
APP_MODE="development"
APP_API_URL="http://test-api.com"
```

```yml
# .env.production 文件配置
APP_MODE="production"
APP_API_URL="https://api.com"
```

2. 创建 `gulpfile.js` 文件
```js
const gulp = require('gulp')
const envInject = require('gulp-env-loader')() //!建议放在前面，并立即执行

// 输出配置的环境变量
console.log('env', envInject.env)

gulp.task('build', function() {
  return gulp.src('./src/*.js', { sourcemaps: true })
    .pipe(envInject())
    .pipe(gulp.dest('./dist', { sourcemaps: '.' }))
})
```

3. 运行时可以加上 环境模式参数`mode`, 这样会自动加载对应的环境变量配置文件。
```
gulp build --mode=production
```

4. 输出结果

源文件 `./src/api.js`
```js
export function userLogin(params) {
  return http.post(`${process.env.APP_API_URL}/user/login`, params)
}
```
输出文件 `./dist/api.js`
```js
export function userLogin(params) {
  return http.post(`https://api.com/user/login`, params)
}
```


## API
```ts
require('gulp-env-loader')([config])
```

### 参数 config
可选的配置对象或配置文件路径。  
如果是字符串，则表示配置文件路径。如果是对象，则可以包含以下属性：
- `path` - (`string`) 配置文件路径, 默认为 `.env` 
- `mode` - (`string`) 环境模式名称。
- `modekey` - (`string`) 环境模式键名, 默认为 `mode`
- - `ignoreProcessEnv` - (`boolean`) 是否写入 `process.env`


### 返回值
```js
envInject([option])
```
创建一个 through2 流，用于替换文件内容中的环境变量。
- `isVar` - (`boolean`) 将环境变量替换为对应值的字符串表示 (加单引号)。默认为 `true`
- `env` - (`object`) 额外的环境变量对象


## Thanks
* [dotenv](https://www.npmjs.com/package/dotenv)
* [dotenv-expand](https://www.npmjs.com/package/dotenv-expand)
* https://juejin.cn/post/6993224664705138702
