const { join } = require('path');

const PROJECT_PATH = process.cwd();

const CONFIG_FILE_NAME = 'formlogic.config.cjs';
const CONFIG_TPL_FILE_NAME = 'formlogic.config.js.tpl';

const OUTPUT_PATH_README = 'README.md';

const README_TPL_PATH = join(__dirname, `./tpl/${OUTPUT_PATH_README}.tpl`);

const CONFIG_TPL_PATH = join(__dirname, `./tpl/${CONFIG_TPL_FILE_NAME}`);
const LOGIC_TPL_PATH = join(__dirname, `./tpl/logic.js.tpl`);

const CONFIG_FILE_PATH = join(PROJECT_PATH, CONFIG_FILE_NAME);

const pkgPath = join(PROJECT_PATH, 'package.json');

const DEFAULT_EXPRESS_PORT = '3200';
const DEFAULT_EXPRESS_IP = '127.0.0.1';

const DEFAULT_CONFIG = {
  outputPath: join(PROJECT_PATH, './src/low-code-meta/'),
  ip: DEFAULT_EXPRESS_IP,
  port: DEFAULT_EXPRESS_PORT,
  npmRegistry: 'https://registry.npmjs.com/',
  fileExt: 'ts',
};

module.exports = {
  DEFAULT_CONFIG,
  pkgPath,
  CONFIG_FILE_PATH,
  LOGIC_TPL_PATH,
  CONFIG_TPL_PATH,
  README_TPL_PATH,
  PROJECT_PATH,
  OUTPUT_PATH_README,
  DEFAULT_EXPRESS_PORT
};
