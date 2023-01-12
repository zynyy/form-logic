import { getModelPageAllConfig } from './modelPage';
import { getJsonFileContent, generateFile } from './file.cjs';
import { toArray } from './fieldMeta';


export const getComponentPath = ({ outputPath }) => {
  const componentPath = `${outputPath}/component/index.json`;

  return { componentPath };
};

export const getComponentContent = ({ outputPath }) => {
  const { componentPath } = getComponentPath({ outputPath });

  const { list } = getJsonFileContent(componentPath);

  return {
    list: toArray(list),
  };
};

export const getComponentDetail = ({ outputPath, code }) => {
  const { list } = getComponentContent({ outputPath });

  return list.find((cur) => cur.code === code);
};

export const getComponentAllData = ({ outputPath }) => {
  const { list } = getComponentContent({ outputPath });

  return list.map((item) => {
    const { code, name } = item || {};
    return {
      code,
      name,
    };
  });
};

export const checkComponent = ({ outputPath, code }) => {
  const { list } = getComponentContent({ outputPath });

  const repeat = list.find((cur) => cur.code === code);

  let msg = '';

  if (repeat) {
    msg += `组件编码: ${code} 重复`;
  }

  return msg;
};

export const checkUseComponent = ({ outputPath, code }) => {
  const allData = getModelPageAllConfig({ outputPath });

  const use = allData.find((cur) => {
    const { data } = cur || {};
    return toArray(data).find((item) => item.component === code);
  });

  let msg = '';

  if (use) {
    msg += `组件编码: ${code} 还在使用中`;
  }

  return msg;
};

export const removeComponent = ({ outputPath, code }) => {
  const { componentPath } = getComponentPath({ outputPath });
  const { list } = getComponentContent({ outputPath });

  generateFile(
    componentPath,
    JSON.stringify({
      list: list.filter((item) => item.code !== code),
    }),
  );
};

export const generateComponent = ({ outputPath, record }) => {
  const { componentPath } = getComponentPath({ outputPath });

  const { list } = getComponentContent({ outputPath });

  generateFile(
    componentPath,
    JSON.stringify({
      list: toArray(record).concat(list),
    }),
  );
};

export const updateComponent = ({ outputPath, record }) => {
  const { componentPath } = getComponentPath({ outputPath });

  const { list } = getComponentContent({ outputPath });

  generateFile(
    componentPath,
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
