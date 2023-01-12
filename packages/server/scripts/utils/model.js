import path from 'path';

import { readIndexFileList } from './require-context/readFileList';
import { getJsonFileContent, generateFile, getFileExists, deleteDir } from './file.cjs';

export const generateModel = ({ outputPath, code, content }) => {
  const { modelCodeIndexPath } = getModelPath({
    outputPath,
    code,
  });

  generateFile(modelCodeIndexPath, JSON.stringify(content));
};

export const getModelPath = ({ outputPath, code }) => {
  const modelPath = `${outputPath}${outputPath.endsWith(path.sep) ? '' : '/'}model`;

  const modelCodePath = `${modelPath}/${code}`;

  const modelCodeIndexPath = `${modelCodePath}/index.json`;

  return {
    modelPath,
    modelCodePath,
    modelCodeIndexPath,
  };
};

export const getModelAllData = ({ outputPath }) => {
  const { modelPath } = getModelPath({ outputPath });

  return readIndexFileList(modelPath, ['.json']).map((item) => {
    const [_, fullPath] = item;

    const { code, name } = getJsonFileContent(`${fullPath}/index.json`);

    return {
      code,
      name,
    };
  });
};

export const checkModelPath = ({ outputPath, code }) => {
  const { modelCodePath } = getModelPath({ outputPath, code });
  return getFileExists(modelCodePath);
};

export const removeModel = ({ outputPath, code }) => {
  const { modelCodePath } = getModelPath({ outputPath, code });
  deleteDir(modelCodePath);
};

export const getModelDetail = ({ outputPath, code }) => {
  const { modelCodeIndexPath } = getModelPath({ outputPath, code });

  return getJsonFileContent(modelCodeIndexPath);
};
