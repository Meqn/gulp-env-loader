/// <reference types="node" />

interface EnvConfig {
  /**
   * The .env file path
   */
  path?: string;
  /**
   * The mode to use
   */
  mode?: string;
  /**
   * The key to use for the mode
   */
  modeKey?: string;
  /**
   * Turn off writing to process.env
   */
  ignoreProcessEnv?: boolean;
}

interface EnjectOptions {
  /**
   * Whether or not to use quotes around the value
   */
  isVar?: boolean;
  /**
   * Additional environment variables
   */
  env?: object;
}

declare function envLoader(config?: EnvConfig | string): {
  (options?: EnjectOptions): NodeJS.ReadWriteStream;
  env: object;
};

export = envLoader;
