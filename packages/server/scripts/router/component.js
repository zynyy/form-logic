import { Router } from 'express';
import { filterCodeAndName,  sendJson, sendJsonPage } from '../utils';
import {
  checkComponent,
  checkUseComponent,
  generateComponent,
  getComponentAllData,
  getComponentDetail,
  removeComponent,
  updateComponent,
} from '../utils/component';
import { getConfig } from '../utils/config.cjs';

const { outputPath } = getConfig() || {};

export const componentRouter = Router();

const componentDetail = async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return sendJson(res, false, `code 不能为空`);
  }

  const record = getComponentDetail({ outputPath, code });

  if (record) {
    return sendJson(res, record);
  }
  return sendJson(res, false, `无法找到组件编码：${code}`);
};

const componentList = async (req, res) => {
  const componentData = getComponentAllData({ outputPath });

  sendJson(res, componentData);
};

const componentPage = async (req, res) => {
  const { current = 1, pageSize = 30, code, name } = req.query;


  const componentData = filterCodeAndName(getComponentAllData({ outputPath }), code, name);

  sendJsonPage(res, {
    data: componentData,
    current,
    pageSize,
  });
};

const componentConfig = async (req, res) => {
  const { componentCode } = req.query;
  if (!componentCode) {
    return sendJson(res, false, `componentCode 不能为空`);
  }

  const record = getComponentDetail({ outputPath, code: componentCode });

  if (record) {
    const { componentPropsPageCode, componentProps } = record || {};

    return sendJson(res, {
      pageCode: componentPropsPageCode,
      componentProps: componentProps || {},
    });
  }

  sendJson(res, undefined, `无法找到组件 ${componentCode} 的属性配置`);
};

const componentCreate = async (req, res) => {
  const { code, ...restData } = req.body || {};

  const result = checkComponent({ code, outputPath });

  if (result) {
    return sendJson(res, false, result);
  }

  const record = {
    code,
    ...restData,
  };

  generateComponent({
    outputPath,
    record,
  });

  return sendJson(res, record);
};

const componentUpdate = async (req, res) => {
  const { code, ...restData } = req.body;

  const result = checkComponent({ code, outputPath });

  if (!result) {
    return sendJson(res, false, `组件编码：${code}无法找到`);
  }

  const content = {
    code,
    ...restData,
  };

  updateComponent({
    outputPath,
    record: content,
  });

  sendJson(res, content);
};

const componentRemove = async (req, res) => {
  const { code } = req.body;

  if (!code) {
    return sendJson(res, false, `code 不能为空`);
  }



  const use = checkUseComponent({ outputPath, code });

  if (use) {
    return sendJson(res, false, use);
  }

  removeComponent({ outputPath, code });

  sendJson(res, code);
};

componentRouter.post('/local-api/component/create', componentCreate);
componentRouter.get('/local-api/component/detail', componentDetail);
componentRouter.get('/local-api/component/list', componentList);
componentRouter.get('/local-api/component/page', componentPage);
componentRouter.get('/local-api/component/componentConfig', componentConfig);
componentRouter.post('/local-api/component/update', componentUpdate);
componentRouter.delete('/local-api/component/remove', componentRemove);
