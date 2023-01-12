import { getModelPageAllConfig } from './modelPage';
import { getJsonFileContent, generateFile } from './file.cjs';
import { toArray } from './fieldMeta';

export const getValidateRulesPath = ({ outputPath }) => {
  const validateRulesPath = `${outputPath}/validate-rules/index.json`;

  return { validateRulesPath };
};

export const getValidateRulesContent = ({ outputPath }) => {
  const { validateRulesPath } = getValidateRulesPath({ outputPath });

  const { list } = getJsonFileContent(validateRulesPath);

  return {
    list: toArray(list),
  };
};

export const getValidateRulesDetail = ({ outputPath, code }) => {
  const { list } = getValidateRulesContent({ outputPath });

  return list.find((cur) => cur.code === code);
};

export const getValidateRulesAllData = ({ outputPath }) => {
  const { list } = getValidateRulesContent({ outputPath });

  return list.map((item) => {
    const { code, name } = item || {};
    return {
      code,
      name,
    };
  });
};

export const checkValidateRules = ({ outputPath, code }) => {
  const { list } = getValidateRulesContent({ outputPath });

  const repeat = list.find((cur) => cur.code === code);

  let msg = '';

  if (repeat) {
    msg += `验证规则编码: ${code} 重复`;
  }

  return msg;
};

export const checkUseValidateRules = ({ outputPath, code }) => {
  const allData = getModelPageAllConfig({ outputPath });

  const use = allData.find((cur) => {
    const { data } = cur || {};
    return toArray(data).find((item) => item.component === code);
  });

  let msg = '';

  if (use) {
    msg += `验证规则编码: ${code} 还在使用中`;
  }

  return msg;
};

export const removeValidateRules = ({ outputPath, code }) => {
  const { validateRulesPath } = getValidateRulesPath({ outputPath });
  const { list } = getValidateRulesContent({ outputPath });

  generateFile(
    validateRulesPath,
    JSON.stringify({
      list: list.filter((item) => item.code !== code),
    }),
  );
};

export const generateValidateRules = ({ outputPath, record }) => {
  const { validateRulesPath } = getValidateRulesPath({ outputPath });

  const { list } = getValidateRulesContent({ outputPath });

  generateFile(
    validateRulesPath,
    JSON.stringify({
      list: toArray(record).concat(list),
    }),
  );
};

export const updateValidateRules = ({ outputPath, record }) => {
  const { validateRulesPath } = getValidateRulesPath({ outputPath });

  const { list } = getValidateRulesContent({ outputPath });

  generateFile(
    validateRulesPath,
    JSON.stringify({
      list: list.map((item) => {
        if (item.code === record.code) {
          return record;
        }
        return item;
      }),
    }),
  );
};
