import { Router } from 'express';
import { filterCodeAndName, sendJson, sendJsonPage } from '../utils';
import {
  checkModelPath,
  generateModel,
  getModelAllData,
  getModelDetail,
  getModelPath,
  removeModel,
} from '../utils/model';
import { getFileExists } from '../utils/file.cjs';

import { getConfig } from '../utils/config.cjs';

export const modelRouter = Router();

const { outputPath } = getConfig() || {};

const modelDetail = async (req, res) => {
  const { code } = req.query;
  if (!code) {
    return sendJson(res, false, `code 不能为空`);
  }

  const data = getModelDetail({
    outputPath,
    code,
  });

  return sendJson(res, data);
};

const modelRemove = async (req, res) => {
  const { code } = req.body;
  if (!code) {
    return sendJson(res, false, `code 不能为空`);
  }

  const exist = checkModelPath({
    outputPath,
    code,
  });

  if (!exist) {
    return sendJson(res, false, `${code}文件路径不存在无法删除`);
  }

  const data = getModelDetail({
    outputPath,
    code,
  });

  removeModel({
    code,
    outputPath,
  });

  return sendJson(res, {
    model: data,
    success: true,
  });
};

const modelUpdate = async (req, res) => {
  const { metas, code, name } = req.body;

  const { modelCodePath } = getModelPath({
    outputPath,
    code,
  });

  if (!getFileExists(modelCodePath)) {
    return sendJson(res, false, `编码 ${code} 不存在无法更新`);
  }

  const content = {
    code,
    name,
    metas,
  };

  generateModel({
    outputPath,
    code,
    content,
  });

  return sendJson(res, content);
};

const modelCreate = async (req, res) => {
  const { metas, code, name } = req.body;

  const { modelCodePath } = getModelPath({
    outputPath,
    code,
  });

  if (getFileExists(modelCodePath)) {
    return sendJson(res, false, `编码 ${code} 已存在`);
  }

  const content = {
    code,
    name,
    metas,
  };

  generateModel({
    outputPath,
    code,
    content,
  });

  return sendJson(res, content);
};

const modelPage = async (req, res) => {
  const { current = 1, pageSize = 30, code, name } = req.query;

  const modelData = filterCodeAndName(getModelAllData({ outputPath }), code, name);

  return sendJsonPage(res, {
    data: modelData,
    current,
    pageSize,
  });
};


modelRouter.get('/local-api/model/detail', modelDetail);
modelRouter.get('/local-api/model/page', modelPage);
modelRouter.post('/local-api/model/create', modelCreate);
modelRouter.post('/local-api/model/update', modelUpdate);
modelRouter.delete('/local-api/model/remove', modelRemove);
