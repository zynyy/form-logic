import { getJsonFileContent, generateFile } from './file.cjs';

export const toArray = (arr) => {
  if (arr === undefined || arr === null) {
    return [];
  }

  if (Array.isArray(arr)) {
    return arr;
  }
  return [arr];
};

export const getFieldMetaPath = ({ outputPath }) => {
  const fieldMetaPath = `${outputPath}/field-meta/index.json`;

  return { fieldMetaPath };
};

export const getFieldMetaContent = ({ outputPath }) => {
  const { fieldMetaPath } = getFieldMetaPath({ outputPath });

  const { categorize, metas } = getJsonFileContent(fieldMetaPath);

  return {
    categorize: toArray(categorize),
    metas: toArray(metas),
  };
};

export const getFieldMetaDetail = ({ outputPath, code }) => {
  const { metas } = getFieldMetaContent({ outputPath });

  return metas.find((cur) => cur.code === code);
};

export const getCategorizeAllData = ({ outputPath }) => {
  const { categorize } = getFieldMetaContent({ outputPath });

  return categorize.map((item) => {
    const { code, name } = item || {};
    return {
      code,
      name,
    };
  });
};

export const getFieldMetaAllData = ({ outputPath }) => {
  const { metas, categorize } = getFieldMetaContent({ outputPath });

  return metas.map((item) => {
    const { code, name } = item || {};
    return {
      code,
      name,
      categorize: categorize.find((cur) => cur.code === item.categorize)?.name,
    };
  });
};

export const getButtonMeta = ({ outputPath }) => {
  const { metas } = getFieldMetaContent({ outputPath });
  return metas
    .filter((item) => {
      const { categorize } = item || {};
      return categorize === 'button';
    })
    .map((item) => {
      const { code, name } = item || {};
      return { code, name };
    });
};

export const getContainerMeta = ({ outputPath }) => {
  const { metas } = getFieldMetaContent({ outputPath });
  return metas
    .filter((item) => {
      const { categorize } = item || {};
      return categorize === 'container';
    })
    .map((item) => {
      const { code, name } = item || {};
      return { code, name };
    });
};

export const checkFieldMeta = ({ outputPath, metas, categorize }) => {
  const { categorize: oldCategorize, metas: oldMetas } = getFieldMetaContent({ outputPath });

  const repeatCategorize = toArray(categorize).filter((item) => {
    return oldCategorize.find((cur) => cur.code === item.code);
  });

  const repeatMeta = toArray(metas).filter((item) => {
    return oldMetas.find((cur) => cur.code === item.code);
  });

  let msg = '';

  if (repeatCategorize.length) {
    msg += `分类编码: ${repeatCategorize.map((item) => item.code).join('、')} 重复`;
  }

  if (repeatMeta.length) {
    msg += `字段编码: ${repeatMeta.map((item) => item.code).join('、')} 重复`;
  }

  return msg;
};

export const removeFieldMeta = ({ outputPath, code }) => {
  const { fieldMetaPath } = getFieldMetaPath({ outputPath });
  const { categorize: oldCategorize, metas: oldMetas } = getFieldMetaContent({ outputPath });

  generateFile(
    fieldMetaPath,
    JSON.stringify({
      categorize: oldCategorize,
      metas: oldMetas.filter((item) => item.code !== code),
    }),
  );
};

export const generateFieldMetaContent = ({ outputPath, metas, categorize }) => {
  const { fieldMetaPath } = getFieldMetaPath({ outputPath });

  const { categorize: oldCategorize, metas: oldMetas } = getFieldMetaContent({ outputPath });

  generateFile(
    fieldMetaPath,
    JSON.stringify({
      categorize: toArray(categorize)
        .filter((item) => {
          return !oldCategorize.find((cur) => cur.code === item.code);
        })
        .concat(oldCategorize),
      metas: toArray(metas)
        .filter((item) => {
          return !oldMetas.find((cur) => cur.code === item.code);
        })
        .concat(oldMetas),
    }),
  );
};

export const updateFieldMetaContent = ({ outputPath, content }) => {
  const { fieldMetaPath } = getFieldMetaPath({ outputPath });

  const { categorize: oldCategorize, metas: oldMetas } = getFieldMetaContent({ outputPath });

  generateFile(
    fieldMetaPath,
    JSON.stringify({
      categorize: oldCategorize,
      metas: toArray(oldMetas).map((item) => {
        if (item.code === content.code) {
          return content;
        }
        return item;
      }),
    }),
  );
};
