import { Message } from 'element-ui';

import { MetaSchema } from '@/interface';
import { getBatchModelPageDetail, getModelPageDetail } from './request';

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

export const getJson = (pageCode?: string) => {
  if (!pageCode) {
    return Promise.reject();
  }

  const path = getModelPagePath(pageCode);

  return fetch(path)
    .then((res) => {
      return res.json();
    })
    .catch((err) => {
      Message.error(`${path} 文件不存在 ${err}`);
      return Promise.reject(err);
    });
};

export const getItemJsonMetaSchema: (
  metaData: MetaSchema,
  local: boolean,
) => Promise<MetaSchema> = async (metaData, local) => {
  const codes =
    metaData?.data?.filter((item) => {
      const { pageCode } = item || {};
      return pageCode;
    }) || [];

  if (codes.length) {
    if (local) {
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
            const index = codes.findIndex(
              (cur) => cur.pageCode === item.pageCode,
            );

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
    } else {
      const pageData = await getBatchModelPageDetail(
        codes.map((item) => item.pageCode) as string[],
      );

      return {
        ...metaData,
        data: metaData.data.map((item) => {
          const { pageCode } = item || {};

          if (pageCode) {
            const record = pageData[pageCode];

            return {
              ...item,
              itemMetaSchema: record.value,
            };
          }

          return item;
        }),
      };
    }
  }

  return metaData;
};

export const getJsonMetaSchema: (pageCode: string) => Promise<MetaSchema> = (
  pageCode: string,
) => {
  return getModelPageDetail(pageCode)
    .then((metaData) => {
      return getItemJsonMetaSchema(metaData, false);
    })
    .catch(() => {
      return getJson(pageCode).then((metaData) => {
        return getItemJsonMetaSchema(metaData, true);
      });
    });
};
