/* eslint-disable strict */
const inquirer = require('inquirer');

const { resolve, sep } = require('path');

const { existsSync, readFileSync, readdirSync } = require('fs');
const ejs = require('ejs');

const {
  camelCaseToUppercase,
  hyphenToUpperCamelCase,
  hyphenToLowerCamelCase,
  generateFile,
  loaderRouter,
} = require('./utils');

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
    detail: `${listModelCode}_D`,
    edit: `${listModelCode}_U`,
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
    noQueryKeys: isNoQueryKeys,
    fileNameLower,
  };

  const content = ejs.render(readFileSync(ejsTempPath, 'utf8'), ejsParams);

  generateFile(`${listPath}/${fileNameLower}Edit.tsx`, content);
};

const generateDetail = () => {
  const ejsTempPath = `${__dirname}/pc-list-ejs/detail.ejs`;

  const ejsParams = {
    fileName,
    noQueryKeys: isNoQueryKeys,
    fileNameLower,
  };

  const content = ejs.render(readFileSync(ejsTempPath, 'utf8'), ejsParams);

  generateFile(`${listPath}/${fileNameLower}Detail.tsx`, content);
};

const generateCreate = () => {
  const ejsTempPath = `${__dirname}/pc-list-ejs/create.ejs`;

  const ejsParams = {
    fileName,
    fileNameLower,
  };

  const content = ejs.render(readFileSync(ejsTempPath, 'utf8'), ejsParams);

  generateFile(`${listPath}/${fileNameLower}Create.tsx`, content);
};

const generateList = () => {
  const ejsTempPath = isTreeList
    ? `${__dirname}/pc-list-ejs/treeList.ejs`
    : `${__dirname}/pc-list-ejs/list.ejs`;

  const ejsParams = {
    fileName,
    fileNameLower,
    isNoModal: isLink,
    showWay: isModal ? 'modal' : 'drawer',
    noQueryKeys: isNoQueryKeys,
    isHist
  };

  const content = ejs.render(readFileSync(ejsTempPath, 'utf8'), ejsParams);

  generateFile(`${listPath}/index.tsx`, content);
};

const generateHistoryList = () => {
  const ejsTempPath = `${__dirname}/pc-list-ejs/hist.ejs`;

  const ejsParams = {
    fileName,
    fileNameLower,
    noQueryKeys: isNoQueryKeys
  };

  const content = ejs.render(readFileSync(ejsTempPath, 'utf8'), ejsParams);
  generateFile(`${listPath}/${fileNameLower}Hist.tsx`, content);
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
  const name = camelCaseToUppercase(fileName);

  const addRouter = [
    {
      path: `${urlPath}`,
      name: `${fileName}List`,
      component: `.${urlPath}`,
    },
  ];
  if (isLink) {
    addRouter.push(
      {
        path: `${urlPath}/create`,
        name: `${fileName}Create`,
        component: `.${urlPath}/${fileNameLower}Create`,
      },
      {
        path: `${urlPath}/edit`,
        name: `${fileName}Edit`,
        component: `.${urlPath}/${fileNameLower}Edit`,
      },
      {
        path: `${urlPath}/detail`,
        name: `${fileName}Detail`,
        component: `.${urlPath}/${fileNameLower}Detail`,
      }
    );
  }

  const content = `
    const ${name} = ${JSON.stringify(addRouter)};
    export default ${name}
  `;
  generateFile(`${LIST_PAGE_ROUTER_DIR}/${fileNameLower}.ts`, content, () => {
    loaderRouter(LIST_PAGE_ROUTER_DIR);
    console.log(`文件路径: ${listPath} 按照生成规则。已生成相关文件成功`);
  });
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
  if(isHist){
    generateHistoryList()
  }
  generateRouter();
};

const inputPath = () => {
  prompt([
    {
      type: 'input',
      name: 'path',
      message: '文件夹路径',
      validate: val => {
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
      choices: ['跳转 Link', '抽屉 Drawer', '弹窗 Modal', '树形 TreeList'],
      validate: val => {
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
      validate: val => {
        if (val) {
          return true;
        }
        return '请输入模型编码';
      },
    },
  ]).then(answers => {
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
    fileNameLower = hyphenToLowerCamelCase(fileName);

    generateFiles();
  });
};

inputPath();
