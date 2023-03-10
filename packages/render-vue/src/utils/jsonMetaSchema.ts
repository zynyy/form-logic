import { message } from 'ant-design-vue';

import { MetaSchema } from '@/interface';

const formLogicConfig = {
  outputRootPath: 'low-code-meta',
};

export const setOutputRootPath = (outputRootPath: string) => {
  formLogicConfig.outputRootPath = outputRootPath;
};

export const getModelPagePath = (pageCode: string) => {
  const [model] = pageCode.split('_');

  return `/${formLogicConfig.outputRootPath}/model-page/${model}/${pageCode}.json`;
};

export const getJson = (pageCode: string) => {
  const path = getModelPagePath(pageCode);

  return fetch(path)
    .then((res) => {
      return res.json();
    })
    .catch((err) => {
      message.error(`${path} 文件不存在 ${err}`).then(() => void 0);
      return Promise.reject(err);
    });
};

export const getItemJsonMetaSchema: (metaData: MetaSchema) => Promise<MetaSchema> = async (
  metaData,
) => {
  const codes =
    metaData?.data?.filter((item) => {
      const { pageCode } = item || {};
      return pageCode;
    }) || [];

  if (codes) {
    const pageData = await Promise.allSettled(
      codes.map((cur) => {
        return getJson(cur.pageCode);
      }),
    );

    return {
      ...metaData,
      data: metaData.data.map((item) => {
        const { pageCode } = item || {};

        if (pageCode) {
          const index = codes.findIndex((cur) => cur.pageCode === item.pageCode);

          const record = pageData[index];
          const { status } = record;

          return {
            ...item,
            itemMetaSchema: status === 'fulfilled' ? record.value : undefined,
          };
        }

        return item;
      }),
    };
  }

  return metaData;
};

export const getJsonMetaSchema: (pageCode: string) => Promise<MetaSchema> = (pageCode: string) => {
  return getJson(pageCode).then((metaData) => {
    return getItemJsonMetaSchema(metaData);
  });
};
