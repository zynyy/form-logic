const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');
const os = require('os');
const logicLoader = require('./require-context/logicLoader');

const PROJECT_PATH = process.cwd();

const CONFIG_FILE_NAME = 'formlogic.config.js';
const CONFIG_TPL_FILE_NAME = 'formlogic.config.js.tpl';

const OUTPUT_PATH_README = 'README.md';

const README_TPL_PATH = path.join(__dirname, `./tpl/${OUTPUT_PATH_README}.tpl`);

const CONFIG_TPL_PATH = path.join(__dirname, `./tpl/${CONFIG_TPL_FILE_NAME}`);
const LOGIC_TPL_PATH = path.join(__dirname, `./tpl/logic.js.tpl`);

const CONFIG_FILE_PATH = path.join(PROJECT_PATH, CONFIG_FILE_NAME);

const pkgPath = path.join(PROJECT_PATH, 'package.json');

const DEFAULT_EXPRESS_PORT = '3000';
const DEFAULT_EXPRESS_IP = '127.0.0.1';

const DEFAULT_CONFIG = {
  outputPath: path.join(PROJECT_PATH, './src/low-code-meta/'),
  ip: DEFAULT_EXPRESS_IP,
  port: DEFAULT_EXPRESS_PORT,
  npmRegistry: 'https://registry.npmjs.com/',
  fileExt: 'ts',
};

const mergeConfig = (config) => {
  return {
    ...DEFAULT_CONFIG,
    ...config,
  };
};

const getFileContent = (filepath) => {
  return fs.readFileSync(filepath, 'utf-8');
};

const getPackageJson = () => {
  return JSON.parse(getFileContent(pkgPath) || '{}');
};

const getProjectName = () => {
  const pkgJson = getPackageJson();
  return pkgJson.name;
};

const getPkgDeps = () => {
  const pkgJson = getPackageJson();
  return pkgJson.dependencies || {};
};

const getOutputContent = () => {
  const tplContent = getFileContent(CONFIG_TPL_PATH);
  return tplContent.replace('{projectName}', `'${getProjectName()}'`);
};

const generateFile = (filename, content, cb) => {
  fs.mkdir(path.dirname(filename), { recursive: true }, (err) => {
    if (err) throw err;
    fs.writeFile(filename, content, (err) => {
      if (err) throw err;
      exec(`npx prettier ${filename} --write`);
      exec('git add .');

      console.log(`文件 ${filename} 生成成功`);

      if (cb) {
        cb();
      }
    });
  });
};

const deleteFile = (filename, cb) => {
  fs.unlink(filename, (err) => {
    if (err) throw err;
    exec('git add .');
    if (cb) {
      cb();
    }
  });
};

const getConfig = () => {
  const isConfigFileExisted = fs.existsSync(CONFIG_FILE_PATH);
  if (isConfigFileExisted) {
    return mergeConfig(require(CONFIG_FILE_PATH));
  } else {
    generateFile(CONFIG_FILE_PATH, getOutputContent());
    return DEFAULT_CONFIG;
  }
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

const mergePkg = (dsl) => {
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

const writeLogicLoader = (logicPath, ext) => {
  const outputFileName = logicLoader(logicPath, true, [`.${ext}`]);

  const loaderContent = [];

  outputFileName.forEach((item) => {
    const [name, filePath] = item;
    loaderContent.push(`${name}: () => import('${filePath}')`);
  });

  generateFile(`${logicPath}/loader.${ext}`, `export default {${loaderContent.join(',')}}`);
};

const getSaveDslData = (dsl, code, pageCode) => {
  const { cells } = dsl || {};

  return {
    code,
    pageCode,
    cells: cells.map((item) => {
      const { data } = item || {};
      const { code, dependencies, ...restData } = data || {};
      return {
        ...item,
        data: restData,
      };
    }),
  };
};

const removeNodesFile = (path, nodeIds) => {
  if (fs.existsSync(path)) {
    const files = fs.readdirSync(path);
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

const generateLogicIndex = (basePath, logicPath, ext) => {
  const fullPath = `${basePath}/index.${ext}`;

  generateFile(
    fullPath,
    `
import dsl from './dsl.json';
import nodeFns from './nodeFns';

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

const getLogicPath = ({ outputPath, code, pageCode }) => {
  const [model] = pageCode?.split('_') || [];

  const logicPath = `${outputPath}${outputPath.endsWith(path.sep) ? '' : '/'}logic`;
  const basePath = `${logicPath}/${model || 'common'}/${code}`;
  const nodesPath = `${basePath}/nodes`;
  const dslPath = `${basePath}/dsl.json`;

  return {
    logicPath,
    basePath,
    nodesPath,
    dslPath,
  };
};

const generateLogic = ({ outputPath, code, pageCode, files, fileExtension, dsl }) => {
  const lastIndex = files.length - 1;
  const ext = fileExtension || DEFAULT_CONFIG.fileExt;
  let dslFile = false;
  let nodeFile = false;

  const { logicPath, basePath, nodesPath, dslPath } = getLogicPath({ outputPath, code, pageCode });

  const nodeIds = files.map((item) => item.fileName);

  const generateIndex = () => {
    if (dslFile && nodeFile) {
      generateLogicIndex(basePath, logicPath, ext);

      removeNodesFile(nodesPath, nodeIds);
    }
  };

  generateFile(dslPath, JSON.stringify(getSaveDslData(dsl)), () => {
    dslFile = true;
    generateIndex();
  });

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

const getDslJson = (dslPath) => {
  return JSON.parse(getFileContent(dslPath) || '{}');
};

const getLogicDsl = ({ outputPath, code, pageCode, fileExtension }) => {
  const { nodesPath, dslPath } = getLogicPath({ outputPath, code, pageCode });

  const dsl = getDslJson(dslPath);

  const ext = fileExtension || DEFAULT_CONFIG.fileExt;

  const { cells } = dsl || {};

  return {
    cells:
      cells?.map((item) => {
        const { id } = item || '';

        const fullPath = `${nodesPath}/${id}.${ext}`;

        if (fs.existsSync(fullPath)) {
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

const checkFile = (outputPath, ext) => {
  const readmePath = `${outputPath}/${OUTPUT_PATH_README}`;

  const { logicPath } = getLogicPath({ outputPath });

  const loaderPath = `${logicPath}/loader.${ext}`;
  const logicIndexPath = `${logicPath}/index.${ext}`;

  if (!fs.existsSync(readmePath)) {
    const outputPathArr = outputPath.split(path.sep);

    const latsIndex = outputPathArr.length - 1;

    const fullPathName = outputPathArr[latsIndex];

    console.log(`检测发现 /README.md 文件不存在即将生成`);

    generateFile(
      readmePath,
      getFileContent(README_TPL_PATH).replaceAll('${outputPath}', fullPathName),
    );
  }

  if (!fs.existsSync(loaderPath)) {
    console.log(`检测发现 logic/loader.${ext} 文件不存在即将生成`);
    writeLogicLoader(logicPath, ext);
  }

  if (!fs.existsSync(logicIndexPath)) {
    console.log(`检测发现 logic/index.${ext} 文件不存在即将生成`);
    generateFile(logicIndexPath, getFileContent(LOGIC_TPL_PATH));
  }
};

module.exports = {
  getConfig,
  mergePkg,
  getPkgDeps,
  DEFAULT_CONFIG,
  DEFAULT_EXPRESS_PORT,
  DEFAULT_EXPRESS_IP,
  generateFile,
  generateLogic,
  getLogicDsl,
  checkFile,
};
