import { Router } from 'express';
import { filterCodeAndName, sendJson, sendJsonPage } from '../utils';
import {
  checkValidateRules,
  checkUseValidateRules,
  generateValidateRules,
  getValidateRulesAllData,
  getValidateRulesDetail,
  removeValidateRules,
  updateValidateRules,
} from '../utils/validateRules';
import { getConfig } from '../utils/config.cjs';

const { outputPath } = getConfig() || {};

export const validateRulesRouter = Router();

const validateRulesDetail = async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return sendJson(res, false, `code 不能为空`);
  }

  const record = getValidateRulesDetail({ outputPath, code });

  if (record) {
    return sendJson(res, record);
  }
  return sendJson(res, false, `无法找到组件编码：${code}`);
};

const validateRulesList = async (req, res) => {
  const validateRulesData = getValidateRulesAllData({ outputPath });

  sendJson(res, validateRulesData);
};

const validateRulesPage = async (req, res) => {
  const { current = 1, pageSize = 30, code, name } = req.query;

  const validateRulesData = filterCodeAndName(getValidateRulesAllData({ outputPath }), code, name);

  sendJsonPage(res, {
    data: validateRulesData,
    current,
    pageSize,
  });
};

const validateRulesConfig = async (req, res) => {
  const { validateRules } = req.query;
  if (!validateRules) {
    return sendJson(res, false, `validateRules 不能为空`);
  }

  const record = getValidateRulesDetail({ outputPath, code: validateRules });

  if (record) {
    const { component, componentProps,defaultValue } = record || {};

    return sendJson(res, {
      component,
      componentProps: componentProps || {},
      defaultValue
    });
  }

  sendJson(res, undefined, `无法找到组件 ${validateRules} 的属性配置`);
};

const validateRulesCreate = async (req, res) => {
  const { code, ...restData } = req.body || {};

  const result = checkValidateRules({ code, outputPath });

  if (result) {
    return sendJson(res, false, result);
  }

  const record = {
    code,
    ...restData,
  };

  generateValidateRules({
    outputPath,
    record,
  });

  return sendJson(res, record);
};

const validateRulesUpdate = async (req, res) => {
  const { code, ...restData } = req.body;

  const result = checkValidateRules({ code, outputPath });

  if (!result) {
    return sendJson(res, false, `规则编码：${code}无法找到`);
  }

  const content = {
    code,
    ...restData,
  };

  updateValidateRules({
    outputPath,
    record: content,
  });

  sendJson(res, content);
};

const validateRulesRemove = async (req, res) => {
  const { code } = req.body;

  if (!code) {
    return sendJson(res, false, `code 不能为空`);
  }

  const use = checkUseValidateRules({ outputPath, code });

  if (use) {
    return sendJson(res, false, use);
  }

  removeValidateRules({ outputPath, code });

  sendJson(res, code);
};

validateRulesRouter.post('/local-api/validate-rules/create', validateRulesCreate);
validateRulesRouter.get('/local-api/validate-rules/detail', validateRulesDetail);
validateRulesRouter.get('/local-api/validate-rules/list', validateRulesList);
validateRulesRouter.get('/local-api/validate-rules/page', validateRulesPage);
validateRulesRouter.get('/local-api/validate-rules/validateRuleConfig', validateRulesConfig);
validateRulesRouter.post('/local-api/validate-rules/update', validateRulesUpdate);
validateRulesRouter.delete('/local-api/validate-rules/remove', validateRulesRemove);
