import { exec } from 'child_process';

import {
  writeFile,
  mkdir,
  unlink,
  readdirSync,
  statSync,
  existsSync,
  unlinkSync,
  rmdirSync,
} from 'fs';
import { dirname, resolve } from 'path';

const HYPHEN_DELIMITED = '-';

const LOWER_REG_EXP = new RegExp(`(${HYPHEN_DELIMITED})[a-z]`, 'g');
const UPPER_REG_EXP = new RegExp(`(^|${HYPHEN_DELIMITED})[a-z]`, 'g');

export const camelCaseToHyphen = (str) => {
  return str.replace(/([a-z0-9])([A-Z])/g, `$1${HYPHEN_DELIMITED}$2`).toLowerCase();
};

// capitalize
export const toFirstLowerCase = (str) => {
  return str.replace(/(^)[A-Z]/, (val) => val.toLocaleLowerCase());
};

export const hyphenToLowerCamelCase = (str) => {
  return str
    .toLowerCase()
    .replace(LOWER_REG_EXP, (val) => val.toUpperCase())
    .split(HYPHEN_DELIMITED)
    .join('');
};

export const hyphenToUpperCamelCase = (str) => {
  return str
    .toLowerCase()
    .replace(UPPER_REG_EXP, (val) => val.toUpperCase())
    .split(HYPHEN_DELIMITED)
    .join('');
};

export const camelCaseToUppercase = (str) => {
  return str.split(HYPHEN_DELIMITED).join('_').toUpperCase();
};

export const generateFile = (filename, content, cb) => {
  mkdir(dirname(filename), { recursive: true }, (err) => {
    if (err) throw err;
    writeFile(filename, content, (err) => {
      if (err) throw err;
      exec(`npx prettier ${filename} --write`);
      exec('git add .');
      console.log(`${filename} 文件生成成功`);

      if (cb) {
        cb();
      }
    });
  });
};

export const deleteFile = (filename, cb) => {
  unlink(filename, (err) => {
    if (err) throw err;
    exec('git add .');
    console.log(`${filename} 文件删除成功`);
    if (cb) {
      cb();
    }
  });
};

export const deleteDir = (path) => {
  if (existsSync(path)) {
    const files = readdirSync(path);
    files.forEach((file) => {
      const curPath = path + '/' + file;
      if (statSync(curPath).isDirectory()) {
        deleteDir(curPath);
      } else {
        unlinkSync(curPath);
      }
    });
    rmdirSync(path);

    console.log(`文件夹: ${path} 删除成功`);
  } else {
    console.log(`文件夹: ${path} 不存在`);
  }
};

export const loaderRouter = (dirPath) => {
  const dir = readdirSync(dirPath);

  let exportData = '';

  const ignoreFile = ['index.tsx', 'index.ts'];

  const routerContent = dir
    .map((val) => {
      if (!ignoreFile.includes(val) && val.endsWith('.ts')) {
        const fileName = val.split('.')[0];
        const modelName = fileName.toLocaleUpperCase();
        exportData += `${modelName},`;
        return `import ${modelName} from './${fileName}';`;
      }
    })
    .filter((val) => val)
    .join('\n');

  generateFile(
    `${dirPath}/index.ts`,

    `${routerContent} \n // @ts-ignore \n export default [].concat(${exportData || []})`,
  );
};

export const LIST_PAGE_ROUTER_DIR = resolve('./src/router/list-page');
