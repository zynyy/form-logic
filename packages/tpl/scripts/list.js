/* eslint-disable strict */
import inquirer from 'inquirer';

import { resolve, sep, dirname } from 'path';
import { existsSync, readFileSync, readdirSync } from 'fs';

import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

import ejs from 'ejs';

import {
  LIST_PAGE_ROUTER_DIR,
  hyphenToUpperCamelCase,
  hyphenToLowerCamelCase,
  generateFile,
  loaderRouter,
  deleteFile,
  deleteDir,
} from './utils';

const prompt = inquirer.prompt;

let listPath = '';

let fileName = '';

let fileNameLower = '';

let isLink = false;

let isModal = false;

let isDrawer = false;

let link = '';

let listModelCode = '';

let urlPath = '';

const generateService = () => {
  const serviceTempPath = `${__dirname}/pc-list-ejs/service.ejs`;

  const ejsParams = {
    fileNameLower,
    fileName,
    create: `${listModelCode}_C`,
    edit: `${listModelCode}_U`,
    detail: `${listModelCode}_D`,
    list: `${listModelCode}_L`,
    link,
    listModelCode,
    isLink,
  };

  const content = ejs.render(readFileSync(serviceTempPath, 'utf8'), ejsParams);

  generateFile(`${listPath}/service.ts`, content);
};

const generateEdit = () => {
  const ejsTempPath = `${__dirname}/pc-list-ejs/edit.ejs`;

  const ejsParams = {
    fileName,
    fileNameLower,
  };

  const content = ejs.render(readFileSync(ejsTempPath, 'utf8'), ejsParams);

  generateFile(`${listPath}/${fileName}Edit.tsx`, content);
};

const generateDetail = () => {
  const ejsTempPath = `${__dirname}/pc-list-ejs/detail.ejs`;

  const ejsParams = {
    fileName,
    fileNameLower,
  };

  const content = ejs.render(readFileSync(ejsTempPath, 'utf8'), ejsParams);

  generateFile(`${listPath}/${fileName}Detail.tsx`, content);
};

const generateCreate = () => {
  const ejsTempPath = `${__dirname}/pc-list-ejs/create.ejs`;

  const ejsParams = {
    fileName,
    fileNameLower,
  };

  const content = ejs.render(readFileSync(ejsTempPath, 'utf8'), ejsParams);

  generateFile(`${listPath}/${fileName}Create.tsx`, content);
};

const generateList = () => {
  let ejsTempPath = `${__dirname}/pc-list-ejs/list.ejs`;

  if (isDrawer) {
    ejsTempPath = `${__dirname}/pc-list-ejs/drawerList.ejs`;
  } else if (isModal) {
    ejsTempPath = `${__dirname}/pc-list-ejs/modalList.ejs`;
  }

  const ejsParams = {
    fileName,
    fileNameLower,
  };

  const content = ejs.render(readFileSync(ejsTempPath, 'utf8'), ejsParams);

  generateFile(`${listPath}/index.tsx`, content);
};

const generateHooks = () => {
  const ejsTempPath = `${__dirname}/pc-list-ejs/hooks.ejs`;

  const ejsParams = {
    fileName,
    fileNameLower,
  };

  const content = ejs.render(readFileSync(ejsTempPath, 'utf8'), ejsParams);

  generateFile(`${listPath}/hooks.ts`, content);
};

// 生成 路由相关页面
const generateRouter = () => {
  const ejsTempPath = `${__dirname}/tpl/router.ejs`;

  const routes = [
    {
      path: `${urlPath}`,
      elementPath: `@/pages/${urlPath}`,
    },
  ];

  if (isLink) {
    routes.push(
      {
        path: `${urlPath}/create`,
        elementPath: `@/pages${urlPath}/${fileName}Create`,
      },
      {
        path: `${urlPath}/edit`,
        elementPath: `@/pages${urlPath}/${fileName}Edit`,
      },
      {
        path: `${urlPath}/detail`,
        elementPath: `@/pages${urlPath}/${fileName}Detail`,
      },
    );
  }

  const ejsParams = {
    fileName,
    routes,
  };

  const content = ejs.render(readFileSync(ejsTempPath, 'utf8'), ejsParams);

  generateFile(`${LIST_PAGE_ROUTER_DIR}/${fileNameLower}.ts`, content, () => {
    loaderRouter(LIST_PAGE_ROUTER_DIR);
    console.log(`文件路径: ${listPath} 按照生成规则。已生成相关文件成功`);
  });
};

const removeFiles = () => {
  deleteFile(`${LIST_PAGE_ROUTER_DIR}/${fileNameLower}.ts`, () => {
    loaderRouter(LIST_PAGE_ROUTER_DIR);
    console.log(`文件路径: ${listPath} 按照删除规则。已删除相关文件成功`);
  });

  deleteDir(listPath);
};

const generateFiles = () => {
  generateService();

  generateHooks();

  if (isLink) {
    generateCreate();
    generateEdit();
    generateDetail();
  }

  generateList();

  generateRouter();
};

export const genList = () => {
  prompt([
    {
      type: 'input',
      name: 'path',
      message: '文件夹路径',
      validate: (val) => {
        if (val) {
          const path = val.startsWith('/') ? val : `/${val}`;

          const fullPath = resolve(`./src/pages${path}`);

          let files = [];

          if (existsSync(fullPath)) {
            files = readdirSync(fullPath);
          }

          return files.length
            ? `文件夹: /src/pages${path} 按照生成规则。该目录已存在故无法生成请更改路径`
            : true;
        }
        return '请输入文件夹路径';
      },
    },
    {
      type: 'list',
      name: 'mode',
      message: '请选择列表模式',
      choices: ['跳转 Link', '抽屉 Drawer', '弹窗 Modal'],
      validate: (val) => {
        if (val) {
          return true;
        }
        return '请选择一种列表模式';
      },
    },
    {
      type: 'input',
      name: 'modelCode',
      message: '列表模型编码',
      validate: (val) => {
        if (val) {
          return true;
        }
        return '请输入模型编码';
      },
    },
  ]).then((answers) => {
    const { path, mode, modelCode } = answers;

    urlPath = path.startsWith('/') ? path : `/${path}`;

    listPath = resolve(`./src/pages${urlPath}`);

    const lastFile = listPath.split(sep).pop();

    isLink = mode.includes('Link');
    isDrawer = mode.includes('Drawer');
    isModal = mode.includes('Modal');
    listModelCode = modelCode;

    link = path.split(sep).join('/');

    fileName = hyphenToUpperCamelCase(lastFile);
    fileNameLower = hyphenToLowerCamelCase(lastFile);

    generateFiles();
  });
};

export const removeList = () => {
  prompt([
    {
      type: 'input',
      name: 'path',
      message: '文件夹路径',
      validate: (val) => {
        if (val) {
          const path = val.startsWith('/') ? val : `/${val}`;

          const fullPath = resolve(`./src/pages${path}`);

          let files = [];

          if (existsSync(fullPath)) {
            files = readdirSync(fullPath);
          }

          return files.length
            ? true
            : `文件夹: /src/pages${path} 按照生成规则。该目录不存在无法删除`;
        }
        return '请输入文件夹路径';
      },
    },
    {
      type: 'confirm',
      name: 'clear',
      message: `是否确定删除`,
      default: false,
    },
  ]).then((answers) => {
    const { path, clear } = answers;

    urlPath = path.startsWith('/') ? path : `/${path}`;

    listPath = resolve(`./src/pages${urlPath}`);

    const lastFile = listPath.split(sep).pop();

    fileName = hyphenToUpperCamelCase(lastFile);
    fileNameLower = hyphenToLowerCamelCase(lastFile);

    if (clear) {
      removeFiles();
    }
  });
};
