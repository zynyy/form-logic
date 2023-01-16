import { Router } from 'express';
import { filterCodeAndName, sendJson, sendJsonPage } from '../utils';
import {
  checkModelPagePath,
  generateModelPage,
  getModelPageAllData,
  getModelPagePath,
} from '../utils/modelPage';
import { getFileExists, getJsonFileContent } from '../utils/file.cjs';
import { toArray } from '../utils/fieldMeta';

import { getConfig } from '../utils/config.cjs';

export const modelPageRouter = Router();

const { outputPath } = getConfig() || {};

const pageConfigDetail = async (req, res) => {
  const { pageCode } = req.query;

  if (!pageCode) {
    return sendJson(res, false, `pageCode 不能为空`);
  }

  const { pageCodePath } = getModelPagePath({
    outputPath,
    pageCode,
  });

  if (!getFileExists(pageCodePath)) {
    return sendJson(res, false, `${pageCode} 无法找到对应文件`);
  }

  return sendJson(res, getJsonFileContent(pageCodePath));
};

const pageConfigBatchDetail = async (req, res) => {
  const { pageCodes } = req.query;

  const content = {};

  toArray(pageCodes).forEach((pageCode) => {
    const { pageCodePath } = getModelPagePath({
      outputPath,
      pageCode,
    });

    content[pageCode] = getJsonFileContent(pageCodePath);
  });

  sendJson(res, content);
};

const pageConfigPage = async (req, res) => {
  const { current = 1, pageSize = 30, code, name, model } = req.query;

  const pageConfigData = filterCodeAndName(getModelPageAllData({ outputPath, model }), code, name);

  return sendJsonPage(res, {
    current,
    pageSize,
    data: pageConfigData,
  });
};

const pageConfigCheck = async (req, res) => {
  const { pageCode } = req.query;

  if (!pageCode) {
    return sendJson(res, false, `pageCode 不能为空`);
  }

  return sendJson(res, checkModelPagePath({ outputPath, pageCode }));
};

const pageConfigCreate = async (req, res) => {
  const { code, ...restData } = req.body;

  if (checkModelPagePath({ outputPath, pageCode: code })) {
    return sendJson(res, false, `${code}文件路径已存在无法创建`);
  }

  const content = {
    code,
    ...restData,
  };

  generateModelPage({
    outputPath,
    pageCode: code,
    content,
  });

  return sendJson(res, content);
};

const pageConfigUpdate = async (req, res) => {
  const { code, ...restData } = req.body;

  if (!checkModelPagePath({ outputPath, pageCode: code })) {
    return sendJson(res, false, `${code}文件路径不存在无法更新`);
  }

  const content = {
    code,
    ...restData,
  };

  generateModelPage({
    outputPath,
    pageCode: code,
    content,
  });

  return sendJson(res, content);
};

const pageConfigUpdateLogic = async (req, res) => {
  const { pageCode, logics } = req.body;

  if (!checkModelPagePath({ outputPath, pageCode })) {
    return sendJson(res, false, `${pageCode}文件路径不存在无法更新`);
  }

  const { pageCodePath } = getModelPagePath({
    outputPath,
    pageCode,
  });

  const { data, ...detailConfig } = getJsonFileContent(pageCodePath);

  const content = {
    ...detailConfig,
    data: toArray(data).map((item) => {
      const { code, type } = item || {};

      return {
        ...item,
        logics: logics
          .filter((cur) => {
            const { fieldType, fieldCode } = cur || {};
            return fieldCode === code && fieldType === type;
          })
          .map((cur) => {
            const { effectHook, logicCode } = cur;
            return {
              logicCode,
              effectHook,
            };
          }),
      };
    }),
  };

  generateModelPage({
    outputPath,
    pageCode,
    content,
  });

  return sendJson(res, content);
};

modelPageRouter.get('/local-api/model-page/detail', pageConfigDetail);
modelPageRouter.get('/local-api/model-page/batchDetail', pageConfigBatchDetail);
modelPageRouter.get('/local-api/model-page/page', pageConfigPage);
modelPageRouter.get('/local-api/model-page/check', pageConfigCheck);
modelPageRouter.post('/local-api/model-page/create', pageConfigCreate);
modelPageRouter.post('/local-api/model-page/update', pageConfigUpdate);
modelPageRouter.post('/local-api/model-page/updateLogic', pageConfigUpdateLogic);
