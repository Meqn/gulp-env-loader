/// <reference types="node" />

interface IConfig {
  /**
   * The .env file path
   */
  path?: string,
  /**
   * The mode to use
   */
  mode?: string,
  /**
   * The key to use for the mode
   */
  modekey?: string,
}

interface IOptions {
  /**
   * Whether or not to use quotes around the value
   */
  isVar: boolean
}

declare function envLoader(config?: IConfig | string): (options?: IOptions) => NodeJS.ReadWriteStream;

export { envLoader as default }
