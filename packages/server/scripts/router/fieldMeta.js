import { Router } from 'express';
import { filterCodeAndName,  sendJson, sendJsonPage } from '../utils';
import {
  checkFieldMeta,
  generateFieldMetaContent,
  getCategorizeAllData,
  getFieldMetaAllData,
  getFieldMetaContent,
  getFieldMetaDetail,
  removeFieldMeta,
  updateFieldMetaContent,
} from '../utils/fieldMeta';
import { getConfig } from '../utils/config.cjs';

export const fieldMetaRouter = Router();

const { outputPath } = getConfig() || {};

const fieldMetaDetail = async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return sendJson(res, false, `code 不能为空`);
  }

  const { outputPath } = this.config || {};

  const record = getFieldMetaDetail({ outputPath, code });

  if (!record) {
    return sendJson(res, false, `无法找到字段编码：${code}`);
  }

  return sendJson(res, record);
};

const fieldMetaPage = async (req, res) => {
  const { current = 1, pageSize = 30, code, name } = req.query;

  const fieldMetaData = filterCodeAndName(getFieldMetaAllData({ outputPath }), code, name);

  return sendJsonPage(res, {
    current,
    pageSize,
    data: fieldMetaData,
  });
};

const fieldMetaTree = async (req, res) => {
  const { metas, categorize } = getFieldMetaContent({ outputPath });

  return sendJson(
    res,
    categorize.map((item) => {
      return {
        key: item.code,
        title: item.name,
        disabled: true,
        children: metas
          .filter((cur) => cur.categorize === item.code)
          .map((cur) => {
            const { code, name, defaultConfig } = cur || {};
            return {
              key: code,
              code: code,
              name: name,
              title: `${code}-${name}`,
              defaultConfig,
            };
          }),
      };
    }),
  );
};

const fieldMetaCreate = async (req, res) => {
  const { categorize, metas } = req.body || {};

  const result = checkFieldMeta({ outputPath, categorize, metas });

  if (result) {
    return sendJson(res, false, result);
  }

  generateFieldMetaContent({
    outputPath,
    categorize,
    metas,
  });

  return sendJson(res, { categorize, metas });
};

const fieldMetaUpdate = async (req, res) => {
  const { code, ...restData } = req.body || {};

  const result = checkFieldMeta({
    outputPath,
    metas: [
      {
        code,
        ...restData,
      },
    ],
  });

  if (!result) {
    return sendJson(res, false, `编码 ${code} 不存在无法更新`);
  }

  const content = {
    code,
    ...restData,
  };

  updateFieldMetaContent({
    outputPath,
    content,
  });

  return sendJson(res, content);
};

const fieldMetaRemove = async (req, res) => {
  const { code } = req.body;

  if (!code) {
    return sendJson(res, false, `code 不能为空`);
  }

  const { outputPath } = this.config || {};

  removeFieldMeta({ outputPath, code });

  return sendJson(res, code);
};

const fieldMetaCategorizeList = async (req, res) => {
  const list = getCategorizeAllData({ outputPath });

  return sendJson(res, list);
};

fieldMetaRouter.get('/local-api/field-meta/detail', fieldMetaDetail);
fieldMetaRouter.get('/local-api/field-meta/page', fieldMetaPage);
fieldMetaRouter.get('/local-api/field-meta/tree', fieldMetaTree);
fieldMetaRouter.post('/local-api/field-meta/create', fieldMetaCreate);
fieldMetaRouter.post('/local-api/field-meta/update', fieldMetaUpdate);
fieldMetaRouter.delete('/local-api/field-meta/remove', fieldMetaRemove);
fieldMetaRouter.get('/local-api/field-meta/categorize/list', fieldMetaCategorizeList);
