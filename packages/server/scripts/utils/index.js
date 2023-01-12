import path from 'path';
import { getFieldMetaPath } from './fieldMeta';
import { getComponentPath } from './component';
import {
  pkgPath,
  LOGIC_TPL_PATH,
  README_TPL_PATH,
  OUTPUT_PATH_README,
  CONFIG_FILE_PATH,
} from './constant.cjs';

import { writeLogicLoader, getLogicPath } from './logic';

import { getFileContent, getJsonFileContent, getFileExists, generateFile } from './file.cjs';
import { getValidateRulesPath } from './validateRules';
import { getConfigContent } from './config.cjs';

const getPackageJson = () => {
  return getJsonFileContent(pkgPath);
};

export const getPkgDeps = () => {
  const pkgJson = getPackageJson();
  return pkgJson.dependencies || {};
};

const extractDep = (dsl) => {
  const mergedDependencies = {};
  const { cells = [] } = dsl;
  cells.forEach((cell) => {
    const { dependencies } = cell.data || {};
    if (dependencies) {
      const json = JSON.parse(dependencies);
      Object.keys(json).forEach((key) => {
        mergedDependencies[key] = json[key];
      });
    }
  });
  return mergedDependencies;
};

export const mergePkg = (dsl) => {
  const pkgJson = getPackageJson();
  const dslDependencies = extractDep(dsl);

  const { dependencies } = pkgJson || {};

  if (!dependencies) {
    pkgJson.dependencies = dslDependencies;
  } else {
    Object.keys(dslDependencies).forEach((key) => {
      if (!dependencies[key]) {
        pkgJson.dependencies[key] = dslDependencies[key];
      }
    });
  }
  generateFile(pkgPath, JSON.stringify(pkgJson, null, 2));
};

export const checkFile = (outputPath, ext) => {
  const readmePath = `${outputPath}/${OUTPUT_PATH_README}`;

  const { logicPath } = getLogicPath({ outputPath });
  const { fieldMetaPath } = getFieldMetaPath({ outputPath });
  const { componentPath } = getComponentPath({ outputPath });
  const { validateRulesPath } = getValidateRulesPath({ outputPath });

  const loaderPath = `${logicPath}/loader.${ext}`;
  const logicIndexPath = `${logicPath}/index.${ext}`;

  if (!getFileExists(readmePath)) {
    const outputPathArr = outputPath.split(path.sep);

    const latsIndex = outputPathArr.length - 1;

    const fullPathName = outputPathArr[latsIndex];

    console.log(`检测发现 /README.md 文件不存在即将生成`);

    generateFile(
      readmePath,
      getFileContent(README_TPL_PATH).replaceAll('${outputPath}', fullPathName),
    );
  }

  if (!getFileExists(CONFIG_FILE_PATH)) {
    generateFile(CONFIG_FILE_PATH, getConfigContent());
  }

  if (!getFileExists(loaderPath)) {
    console.log(`检测发现 logic/loader.${ext} 文件不存在即将生成`);
    writeLogicLoader(logicPath, ext);
  }

  if (!getFileExists(logicIndexPath)) {
    console.log(`检测发现 logic/index.${ext} 文件不存在即将生成`);
    generateFile(logicIndexPath, getFileContent(LOGIC_TPL_PATH));
  }

  if (!getFileExists(fieldMetaPath)) {
    console.log(`检测发现 field-meta/index.json 文件不存在即将生成`);

    generateFile(fieldMetaPath, '{}');
  }

  if (!getFileExists(componentPath)) {
    console.log(`检测发现 component/index.json 文件不存在即将生成`);
    generateFile(componentPath, '{}');
  }

  if (!getFileExists(validateRulesPath)) {
    console.log(`检测发现 validate-rules/index.json 文件不存在即将生成`);
    generateFile(validateRulesPath, '{}');
  }
};

export const filterCodeAndName = (data, code, name) => {
  return data.filter((item) => {
    if (code && name) {
      return item.code?.indexOf(code) !== -1 && item.name?.indexOf(name) !== -1;
    }
    if (code) {
      return item.code?.indexOf(code) !== -1;
    }
    if (name) {
      return item.name?.indexOf(name) !== -1;
    }

    return true;
  });
};

export const sendJson = (res, data, msg) => {
  const json = {
    code: msg ? 500 : 200,
    msg: msg ?? '',
    data: data ?? {},
  };
  res.status(200).json(json);
};

export const sendJsonPage = (res, { data, current, pageSize }) => {
  const startIndex = (current - 1) * pageSize;

  const endIndex = current * pageSize;

  sendJson(res, {
    current,
    pageSize,
    total: data.length,
    list: data.slice(startIndex, endIndex),
  });
};
