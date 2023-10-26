const through = require('through2')
const PluginError = require('plugin-error')
const argv = require('minimist')(process.argv.slice(2))
const loadEnv = require('./loadEnv')

const PLUGIN_NAME = 'gulp-env-loader'

function replaceContent(content, env, isVar) {
  Object.entries(env).forEach(([key, value]) => {
    // content = content.replace(new RegExp(`process\\.env\\.${key}`, 'g'), isVar ? `'${value}'` : value)

    // 完整匹配 env, ${ env }, 'env', "env", {{ env }}, { env }
    // 使用捕获组来匹配这几种格式
    // env 表示匹配 env 字符串，
    // \$\{\s*env\s*\} 表示匹配 ${ env } 格式的字符串，
    // '(?:[^'\\]*(?:\\.[^'\\]*)*)' 表示匹配 ' 包含的字符串，
    // "([^"\\]*(?:\\.[^"\\]*)*)" 表示匹配 " 包含的字符串，
    // \{\{\s*env\s*\}\} 表示匹配 {{ env }} 格式的字符串，
    // \{(?:\s*)env(?:\s*)\} 表示匹配 { env } 格式的字符串。
    content = content.replace(new RegExp(`(process\\.env\\.${key}|\\$\\{\\s*process\\.env\\.${key}\\s*\\}|'(?:[^'\\\\]*(?:\\\\.[^'\\\\]*)*)'|\"([^\"\\\\]*(?:\\\\.[^\"\\\\]*)*)\"|\\{\\{\\s*process\\.env\\.${key}\\s*\\}\\}|\\{(?:\\s*)process\\.env\\.${key}(?:\\s*)})`, 'g'), (match) => {
      const _env = `process.env.${key}`
      if (match === _env) {
        return isVar ? `'${value}'` : value
      } else if (match.startsWith('{') || match.startsWith('${')) {
        return value
      } else {
        return match.replace(`process.env.${key}`, value)
      }
    })
  })
  return content
}

/**
 * generate a function to inject environment variables into files
 *
 * @param {object | string} [config={}] - The configuration object.
 * @param {string} [config.mode] - The mode.
 * @param {string} [config.modeKey] - The mode-key.
 * @param {string} [config.path] - The .env file path.
 * @param {boolean} [config.ignoreProcessEnv] - Turn off writing to process.env
 * @return {function} The envInject function.
 */
module.exports = function envLoader (config = {}) {
  let conf = {
    mode: argv[config.modeKey || 'mode'],
    ignoreProcessEnv: false
  }
  if (config) {
    if (typeof config === 'string') {
      conf.path = config
    } else if (typeof config === 'object') {
      conf = Object.assign({}, conf, config)
    }
  }

  const env = loadEnv(conf)

  /**
   * Inject environment variables into file contents.
   *
   * @param {Object} options - The options for the transform stream (default: {}).
   * @param {boolean} options.isVar - A flag indicating whether to replace variables in the file contents (default: true).
   * @param {Object} options.env - Additional Environment Variables
   * @return {Stream} - The transform stream.
   */
  function envInject(options = {}) {
    return through.obj((file, enc, callback) => {
      if (file.isNull()) {
        return callback(null, file)
      }

      if (file.isStream()) {
        return callback(new PluginError(PLUGIN_NAME, 'Streaming not supported'))
      }

      try {
        const contents = file.contents.toString(enc)
        const replacedContents = replaceContent(contents, Object.assign({}, env, options.env), options.isVar ?? true)
        file.contents = Buffer.from(replacedContents)
      } catch (err) {
        return callback(new PluginError(PLUGIN_NAME, err))
      }

      callback(null, file)
    })
  }

  envInject.env = env
  return envInject
}
