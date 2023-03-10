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

let writeMode = 'sfc'

const generateService = () => {
  const serviceTempPath = `${__dirname}/pc-vue-list-ejs/service.ejs`;

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
  const ejsTempPath = `${__dirname}/pc-vue-list-ejs/${writeMode}/edit.ejs`;

  const ejsParams = {
    fileName,
    fileNameLower,
  };

  const content = ejs.render(readFileSync(ejsTempPath, 'utf8'), ejsParams);

  generateFile(`${listPath}/${fileName}Edit.vue`, content);
};

const generateDetail = () => {
  const ejsTempPath = `${__dirname}/pc-vue-list-ejs/${writeMode}/detail.ejs`;

  const ejsParams = {
    fileName,
    fileNameLower,
  };

  const content = ejs.render(readFileSync(ejsTempPath, 'utf8'), ejsParams);

  generateFile(`${listPath}/${fileName}Detail.vue`, content);
};

const generateCreate = () => {
  const ejsTempPath = `${__dirname}/pc-vue-list-ejs/${writeMode}/create.ejs`;

  const ejsParams = {
    fileName,
    fileNameLower,
  };

  const content = ejs.render(readFileSync(ejsTempPath, 'utf8'), ejsParams);

  generateFile(`${listPath}/${fileName}Create.vue`, content);
};

const generateList = () => {
  let ejsTempPath = `${__dirname}/pc-vue-list-ejs/${writeMode}/list.ejs`;

  if (isDrawer) {
    ejsTempPath = `${__dirname}/pc-vue-list-ejs/${writeMode}/drawerList.ejs`;
  } else if (isModal) {
    ejsTempPath = `${__dirname}/pc-vue-list-ejs/${writeMode}/modalList.ejs`;
  }

  const ejsParams = {
    fileName,
    fileNameLower,
  };

  const content = ejs.render(readFileSync(ejsTempPath, 'utf8'), ejsParams);

  generateFile(`${listPath}/${fileName}.vue`, content);
};

const generateHooks = () => {
  const ejsTempPath = `${__dirname}/pc-vue-list-ejs/hooks.ejs`;

  const ejsParams = {
    fileName,
    fileNameLower,
  };

  const content = ejs.render(readFileSync(ejsTempPath, 'utf8'), ejsParams);

  generateFile(`${listPath}/hooks.ts`, content);
};

// ?????? ??????????????????
const generateRouter = () => {
  const ejsTempPath = `${__dirname}/tpl/routerVue.ejs`;

  const routes = [
    {
      path: `${urlPath}`,
      component: `@/views/${urlPath}/${fileName}.vue`,
    },
  ];

  if (isLink) {
    routes.push(
      {
        path: `${urlPath}/create`,
        component: `@/views${urlPath}/${fileName}Create.vue`,
      },
      {
        path: `${urlPath}/edit`,
        component: `@/views${urlPath}/${fileName}Edit.vue`,
      },
      {
        path: `${urlPath}/detail`,
        component: `@/views${urlPath}/${fileName}Detail.vue`,
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
    console.log(`????????????: ${listPath} ????????????????????????????????????????????????`);
  });
};

const removeFiles = () => {
  deleteFile(`${LIST_PAGE_ROUTER_DIR}/${fileNameLower}.ts`, () => {
    loaderRouter(LIST_PAGE_ROUTER_DIR);
    console.log(`????????????: ${listPath} ????????????????????????????????????????????????`);
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

export const genVueList = () => {
  prompt([
    {
      type: 'input',
      name: 'path',
      message: '???????????????',
      validate: (val) => {
        if (val) {
          const path = val.startsWith('/') ? val : `/${val}`;

          const fullPath = resolve(`./src/views${path}`);

          let files = [];

          if (existsSync(fullPath)) {
            files = readdirSync(fullPath);
          }

          return files.length
            ? `?????????: /src/pages${path} ?????????????????????????????????????????????????????????????????????`
            : true;
        }
        return '????????????????????????';
      },
    },
    {
      type: 'list',
      name: 'mode',
      message: '?????????????????????',
      choices: ['?????? Link', '?????? Drawer', '?????? Modal'],
      validate: (val) => {
        if (val) {
          return true;
        }
        return '???????????????????????????';
      },
    },
    {
      type: 'list',
      name: 'writeMode',
      message: '?????????????????????',
      choices: ['sfc', 'tsx'],
      validate: (val) => {
        if (val) {
          return true;
        }
        return '???????????????????????????';
      },
    },
    {
      type: 'input',
      name: 'modelCode',
      message: '??????????????????',
      validate: (val) => {
        if (val) {
          return true;
        }
        return '?????????????????????';
      },
    },
  ]).then((answers) => {
    const { path, mode, modelCode } = answers;

    urlPath = path.startsWith('/') ? path : `/${path}`;

    listPath = resolve(`./src/views${urlPath}`);

    const lastFile = listPath.split(sep).pop();

    isLink = mode.includes('Link');
    isDrawer = mode.includes('Drawer');
    isModal = mode.includes('Modal');
    listModelCode = modelCode;

    link = path.split(sep).join('/');

    fileName = hyphenToUpperCamelCase(lastFile);
    fileNameLower = hyphenToLowerCamelCase(lastFile);

    writeMode = answers.writeMode

    generateFiles();
  });
};

export const removeVueList = () => {
  prompt([
    {
      type: 'input',
      name: 'path',
      message: '???????????????',
      validate: (val) => {
        if (val) {
          const path = val.startsWith('/') ? val : `/${val}`;

          const fullPath = resolve(`./src/views${path}`);

          let files = [];

          if (existsSync(fullPath)) {
            files = readdirSync(fullPath);
          }

          return files.length
            ? true
            : `?????????: /src/views${path} ???????????????????????????????????????????????????`;
        }
        return '????????????????????????';
      },
    },
    {
      type: 'confirm',
      name: 'clear',
      message: `??????????????????`,
      default: false,
    },
  ]).then((answers) => {
    const { path, clear } = answers;

    urlPath = path.startsWith('/') ? path : `/${path}`;

    listPath = resolve(`./src/views${urlPath}`);

    const lastFile = listPath.split(sep).pop();

    fileName = hyphenToUpperCamelCase(lastFile);
    fileNameLower = hyphenToLowerCamelCase(lastFile);

    if (clear) {
      removeFiles();
    }
  });
};
