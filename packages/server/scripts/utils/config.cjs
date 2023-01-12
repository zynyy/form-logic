const { generateFile, getFileContent, getFileExists, getJsonFileContent } = require('./file.cjs');
const { CONFIG_FILE_PATH, CONFIG_TPL_PATH, DEFAULT_CONFIG, pkgPath } = require('./constant.cjs');

const getPackageJson = () => {
  return getJsonFileContent(pkgPath);
};

const getProjectName = () => {
  const pkgJson = getPackageJson();
  return pkgJson.name;
};

const getConfigContent = () => {
  const tplContent = getFileContent(CONFIG_TPL_PATH);
  return tplContent.replace('{projectName}', `'${getProjectName()}'`);
};

const mergeConfig = (config) => {
  return {
    ...DEFAULT_CONFIG,
    ...config,
  };
};

const getConfig = () => {
  const isConfigFileExisted = getFileExists(CONFIG_FILE_PATH);
  if (isConfigFileExisted) {
    return mergeConfig(require(CONFIG_FILE_PATH));
  } else {
    return DEFAULT_CONFIG;
  }
};

module.exports = {
  getConfig,
  getConfigContent
};
