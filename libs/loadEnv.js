const path = require('path')
const fs = require('fs')
const { parse: envParse } = require('dotenv')
const { expand } = require('dotenv-expand')

function tryStatSync(file) {
  try {
    return fs.statSync(file, { throwIfNoEntry: false })
  } catch (e) {
    // return false
  }
}

function getEnvFiles(mode, envDir) {
  envDir = envDir || process.cwd()
  const files = [
    `.env`,
    `.env.local`,
  ]
  if (mode) {
    files.push(`.env.${mode}`)
    files.push(`.env.${mode}.local`)
  }

  return files.map(file => path.resolve(envDir, file))
}

/**
 * 加载环境变量
 * @param {object | string} config 配置
 * @param {string} config.path 文件路径
 * @param {string} config.mode 模式
 * @param {boolean} config.ignoreProcessEnv 是否写入 process.env
 */
function loadEnv(config = {}) {
  let conf = {}
  let envFiles = []

  if (config && typeof config === 'object') {
    conf = { ...config }
  } else if (typeof config === 'string') {
    conf.path = config
  }

  if (conf.mode === 'local') {
    throw new Error(`"local" cannot be used as a mode name because it conflicts with the .local postfix for .env files.`)
  }

  if (conf.path) {
    if (tryStatSync(conf.path)?.isFile()) {
      envFiles.push(conf.path)
    } else if (tryStatSync(conf.path)?.isDirectory()) {
      envFiles = getEnvFiles(conf.mode, conf.path)
    }
  } else {
    envFiles = getEnvFiles(conf.mode)
  }

  const parsed = Object.fromEntries(
    envFiles.flatMap((file) => {
      if (!tryStatSync(file)?.isFile()) return []

      return Object.entries(envParse(fs.readFileSync(file)))
    })
  )

  const result = expand({ parsed, ignoreProcessEnv: conf.ignoreProcessEnv })
  if (result.error) {
    throw result.error
  }

  return result.parsed
}

module.exports = loadEnv
