import { Router } from 'express';
import { filterCodeAndName,  sendJson, sendJsonPage } from '../utils';
import {
  checkLogicCode,
  checkLogicPath,
  generateLogic,
  getLogicAllData,
  getLogicDsl,
  removeLogic,
} from '../utils/logic';


import { getConfig } from '../utils/config.cjs';

export const logicRouter = Router();

const { outputPath, fileExt } = getConfig() || {};

const logicDetail = (req, res) => {
  const { code, belongCode } = req.query;

  if (!code) {
    return sendJson(res, false, `code 不能为空`);
  }

  const dsl = getLogicDsl({
    outputPath,
    fileExt,
    code,
    pageCode: belongCode,
  });

  return sendJson(res, dsl);
};

const logicPage = (req, res) => {
  const { current = 1, pageSize = 30, code, name } = req.query;

  const logicData = filterCodeAndName(getLogicAllData({ outputPath, fileExt }), code, name);

  return sendJsonPage(res, {
    current,
    pageSize,
    data: logicData,
  });
};

const logicRemove = (req, res) => {
  const { code, belongCode } = req.body;
  if (!code) {
    return sendJson(res, false, `code 不能为空`);
  }

  const exist = checkLogicPath({
    outputPath,
    fileExt,
    code,
    pageCode: belongCode,
  });

  if (!exist) {
    return sendJson(res, false, `${code}文件路径不存在无法删除`);
  }

  const dsl = getLogicDsl({
    outputPath,
    fileExt,
    code,
    pageCode: belongCode,
  });

  removeLogic({
    code,
    pageCode: belongCode,
    outputPath,
    fileExtension: fileExt,
  });

  return sendJson(res, {
    dsl,
    success: true,
  });
};

const logicSave = async (req, res) => {
  const { dsl, code, files, remarks, name, suffix, before, type, belong, checkCode } = req.body;

  if (!code) {
    return sendJson(res, false, `code 不能为空`);
  }



  const isRepeat = checkLogicCode({
    code,
    outputPath,
    fileExt,
  });

  if (isRepeat && checkCode) {
    return sendJson(res, false, `${code}编码重复`);
  }

  generateLogic({
    outputPath,
    code,
    pageCode: belong,
    files,
    dsl,
    fileExtension: fileExt,
    extraSaveData: {
      remarks,
      name,
      suffix,
      before,
      type,
      belong,
    },
  });

  sendJson(res, {
    dsl,
    files,
  });
};

logicRouter.get('/local-api/logic/detail', logicDetail);
logicRouter.get('/local-api/logic/page', logicPage);
logicRouter.post('/local-api/logic/save', logicSave);
logicRouter.delete('/local-api/logic/remove', logicRemove);
