import { MetaSchema } from '@/interface';
import { useEffect, useRef, useState } from 'react';

import { message } from 'antd';
import { computeStyles } from '@popperjs/core';

const formLogicConfig = {
  outputRootPath: 'low-code-meta',
};

export const changeOutputRootPath = (outputRootPath: string) => {
  formLogicConfig.outputRootPath = outputRootPath;
};

export const getModelPagePath = (pageCode: string) => {
  const [model] = pageCode.split('_');

  return `/${formLogicConfig.outputRootPath}/model-page/${model}/${pageCode}.json`;
};

const getJson = (pageCode: string) => {
  const path = getModelPagePath(pageCode);

  return fetch(path)
    .then((res) => {
      return res.json();
    })
    .catch((err) => {
      message.error(`${path} 文件不存在 ${err}`).then(() => void 0);
    });
};

interface JsonMetaSchema {
  metaSchema: MetaSchema;
  loading: boolean;
}

export const useJsonMetaSchema = (modelPageCode: string): JsonMetaSchema => {
  const [metaSchema, setMetaSchema] = useState(null);
  const [loading, setLoading] = useState(false);

  const prevPageCode = useRef<string>('');

  useEffect(() => {
    if (prevPageCode.current !== modelPageCode) {
      if (modelPageCode) {
        setLoading(true);
        getJson(modelPageCode)
          .then(async (metaData) => {
            const codes =
              metaData?.data?.filter((item) => {
                const { pageCode } = item || {};
                return pageCode;
              }) || [];
            prevPageCode.current = modelPageCode;
            if (codes) {
              const pageData = await Promise.allSettled(
                codes.map((cur) => {
                  return getJson(cur.pageCode);
                }),
              );

              setLoading(false);
              setMetaSchema({
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
              });
            } else {
              setLoading(false);
              setMetaSchema(metaData);
            }
          })
          .catch(() => {
            setLoading(false);
            prevPageCode.current = '';
          });
      } else {
        setMetaSchema(null);
        prevPageCode.current = '';
      }
    }
  }, [modelPageCode]);

  return {
    metaSchema,
    loading,
  };
};
