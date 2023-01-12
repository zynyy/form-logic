import path from 'path';

import { getFileExists, generateFile,getJsonFileContent } from './file.cjs';


import { readAllFileList } from './require-context/readFileList';

export const getModelPagePath = ({ outputPath, pageCode, model: argModel }) => {
  const [nextModel] = pageCode?.split('_') || [];

  const model = argModel || nextModel;

  const modelPagePath = `${outputPath}${outputPath.endsWith(path.sep) ? '' : '/'}model-page`;

  const modelPath = model ? `${modelPagePath}/${model}` : '';

  const pageCodePath = modelPath ? `${modelPath}/${pageCode}.json` : '';

  return {
    modelPagePath,
    modelPath,
    pageCodePath,
  };
};

export const getModelPageAllConfig = ({ outputPath, model }) => {
  const { modelPagePath, modelPath } = getModelPagePath({ outputPath, model });

  return readAllFileList(model ? modelPath : modelPagePath, ['.json'])
    .map((item) => {
      const [filename, dirPath] = item;

      return getJsonFileContent(`${dirPath}/${filename}.json`);
    })
    .filter((cur) => Object.keys(cur).length);
};

export const getModelPageAllData = ({ outputPath, model }) => {
  return getModelPageAllConfig({ outputPath, model }).map((item) => {
    const { code, name } = item;

    return {
      code,
      name,
    };
  });
};

export const generateModelPage = ({ outputPath, pageCode, content }) => {
  const { pageCodePath } = getModelPagePath({
    outputPath,
    pageCode,
  });

  generateFile(pageCodePath, JSON.stringify(content));
};

export const checkModelPagePath = ({ outputPath, pageCode }) => {
  const { pageCodePath } = getModelPagePath({ outputPath, pageCode });

  return getFileExists(pageCodePath);
};
