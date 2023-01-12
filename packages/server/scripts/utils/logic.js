import {
  deleteFile,
  getReaddir,
  getFileExists,
  generateFile,
  getJsonFileContent,
  deleteDir,
  getFileContent,
} from './file.cjs';
import path from 'path';

import { DEFAULT_CONFIG } from './constant.cjs';

import logicLoader from './require-context/logicLoader';

export const getLogicPath = ({ outputPath, code, pageCode }) => {
  const [model] = pageCode?.split('_') || [];

  const logicPath = `${outputPath}${outputPath.endsWith(path.sep) ? '' : '/'}logic`;
  const basePath = `${logicPath}/${model || 'common'}/${code}`;
  const nodesPath = `${basePath}/nodes`;
  const dslPath = `${basePath}/dsl.json`;
  const dslOriginPath = `${basePath}/dsl.origin.json`;

  return {
    logicPath,
    basePath,
    nodesPath,
    dslPath,
    dslOriginPath,
  };
};

export const writeLogicLoader = (logicPath, ext) => {
  const outputFileName = logicLoader(logicPath, [`.${ext}`]);

  const loaderContent = [];

  outputFileName.forEach((item) => {
    const [name, filePath] = item;
    loaderContent.push(`${name}: () => import('${filePath}')`);
  });

  generateFile(`${logicPath}/loader.${ext}`, `export default {${loaderContent.join(',')}}`);
};

export const generateLogicIndex = (basePath, logicPath, ext) => {
  const fullPath = `${basePath}/index.${ext}`;

  generateFile(
    fullPath,
    `
import dsl from './dsl.json';
import nodeFns from './nodes';

const logicOptionConfig = {
    dsl,
    nodeFns
}

export default logicOptionConfig
`,
    () => {
      writeLogicLoader(logicPath, ext);
    },
  );
};

const removeNodesFile = (path, nodeIds) => {
  if (getFileExists(path)) {
    const files = getReaddir(path);
    files.forEach((filename) => {
      const existNode = nodeIds.find((node) => filename.startsWith(node));
      if (!existNode) {
        deleteFile(`${path}/${filename}`);
      }
    });
  } else {
    console.log(`文件夹: ${path} 不存在`);
  }
};

const getSaveDslData = (dsl, code, extra) => {
  const { cells } = dsl || {};

  return {
    code,
    ...extra,
    cells,
  };
};

const getSaveSimpleDslData = (dsl, code) => {
  const { cells } = dsl || {};

  return {
    code,
    cells: cells.map((item) => {
      const { data, id, shape, target, source } = item || {};
      const { code, dependencies, ...restData } = data || {};
      return {
        id,
        shape,
        target,
        source,
        data: restData,
      };
    }),
  };
};

const getNodeIndexContent = (nodeIds) => {
  const imports = [];
  const funcMaps = [];
  nodeIds.forEach((id, idx) => {
    const funcName = `fn_${idx}`;
    imports.push(`import ${funcName} from './${id}';`);
    funcMaps.push(`'${id}': ${funcName}`);
  });
  return [
    imports.join('\n'),
    `const nodeFns = {\n  ${funcMaps.join(',\n  ')}\n};`,
    'export default nodeFns;',
  ].join('\n');
};

export const generateLogic = ({
  outputPath,
  code,
  pageCode,
  files,
  fileExtension,
  dsl,
  extraSaveData,
}) => {
  const lastIndex = files.length - 1;
  const ext = fileExtension || DEFAULT_CONFIG.fileExt;
  let dslFile = false;
  let nodeFile = false;

  const { logicPath, basePath, nodesPath, dslPath, dslOriginPath } = getLogicPath({
    outputPath,
    code,
    pageCode,
  });

  const nodeIds = files.map((item) => item.fileName);

  const generateIndex = () => {
    if (dslFile && nodeFile) {
      generateLogicIndex(basePath, logicPath, ext);

      removeNodesFile(nodesPath, nodeIds);
    }
  };

  generateFile(dslPath, JSON.stringify(getSaveSimpleDslData(dsl, code)), () => {
    dslFile = true;
    generateIndex();
  });

  generateFile(dslOriginPath, JSON.stringify(getSaveDslData(dsl, code, extraSaveData)));

  files.forEach((item, index) => {
    const { fileName, content } = item || {};
    const fullPath = `${nodesPath}/${fileName}.${ext}`;
    generateFile(fullPath, content, () => {
      if (index === lastIndex) {
        const indexPath = `${nodesPath}/index.${ext}`;
        generateFile(indexPath, getNodeIndexContent(nodeIds));

        nodeFile = true;

        generateIndex();
      }
    });
  });
};

export const getLogicAllData = ({ outputPath, fileExt }) => {
  const { logicPath } = getLogicPath({
    outputPath,
  });

  const ext = fileExt || DEFAULT_CONFIG.fileExt;

  return logicLoader(logicPath, [`.${ext}`]).map((item) => {
    const [code, _, fullPath] = item;
    const { name, remarks, belong } = getJsonFileContent(`${fullPath}/dsl.origin.json`);

    return {
      code,
      name,
      remarks,
      belong,
    };
  });
};

export const removeLogic = ({ outputPath, code, pageCode, fileExtension }) => {
  const { basePath, logicPath } = getLogicPath({ outputPath, code, pageCode });

  deleteDir(basePath);

  const ext = fileExtension || DEFAULT_CONFIG.fileExt;

  writeLogicLoader(logicPath, ext);
};

export const getLogicDsl = ({ outputPath, code, pageCode, fileExtension }) => {
  const { nodesPath, dslOriginPath } = getLogicPath({ outputPath, code, pageCode });

  const dsl = getJsonFileContent(dslOriginPath);

  const ext = fileExtension || DEFAULT_CONFIG.fileExt;

  const { cells, remarks, name, suffix, before, type, belong } = dsl || {};

  const codeArray = code?.split('_');

  const codeBefore = codeArray[0] || '';
  const codeSuffix = codeArray.slice(1) || [];

  return {
    remarks,
    name,
    suffix: suffix || codeSuffix?.join('_'),
    before: before || `${codeBefore}_`,
    type: type || 'com',
    belong: belong || codeBefore,
    cells:
      cells?.map((item) => {
        const { id } = item || '';

        const fullPath = `${nodesPath}/${id}.${ext}`;

        if (getFileExists(fullPath)) {
          return {
            ...item,
            data: {
              ...item.data,
              code: getFileContent(fullPath),
            },
          };
        }

        return item;
      }) || [],
  };
};

export const checkLogicCode = ({ code, outputPath, fileExt }) => {
  const allData = getLogicAllData({ outputPath, fileExt });

  return !!allData.find((item) => item[code] === code);
};

export const checkLogicPath = ({ outputPath, code, pageCode }) => {
  const { basePath } = getLogicPath({ outputPath, code, pageCode });

  return getFileExists(basePath);
};

const getLogicInfo = (logicPath) => {
  const path = `${logicPath}/dsl.origin.json`;

  return getJsonFileContent(path);
};

export const getCommonLogic = ({ outputPath }) => {
  return getModelLogic({ outputPath, modelCode: 'common' });
};

export const getModelLogic = ({ outputPath, modelCode }) => {
  if (!modelCode) {
    return [];
  }

  const { logicPath } = getLogicPath({ outputPath });

  const modelLogicPath = `${logicPath}/${modelCode}`;

  if (getFileExists(modelLogicPath)) {
    const dirCodes = getReaddir(modelLogicPath);

    return dirCodes.map((dir) => {
      const logicPath = path.join(modelLogicPath, dir);

      const { code, name } = getLogicInfo(logicPath);

      return {
        code,
        name,
      };
    });
  }

  return [];
};
