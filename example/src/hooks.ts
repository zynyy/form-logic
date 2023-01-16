import { useEffect, useState } from 'react';
import { getModelPagePath } from '@/utils/utils';

import { message } from 'antd';
import type { MetaSchema, MetaSchemaData } from '@formlogic/render';

export const useOpen = (): [boolean, () => void, () => void] => {
  const [open, setOpen] = useState(() => {
    return false;
  });

  const show = () => {
    setOpen(true);
  };

  const hidden = () => {
    setOpen(false);
  };

  return [open, show, hidden];
};

const getJson = (pageCode) => {
  const path = getModelPagePath(pageCode);

  return fetch(path)
    .then((res) => {
      return res.json();
    })
    .catch((err) => {
      message.error(`${path} 文件不存在 ${err}`).then(() => void 0);
    });
};

export const getItemMetaSchema: (metaData: MetaSchema) => Promise<MetaSchema> = async (
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

export const useMetaSchema = (modelPageCode: string): [MetaSchema, boolean] => {
  const [metaSchema, setMetaSchema] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (modelPageCode) {
      setLoading(true);
      getJson(modelPageCode)
        .then(async (metaData) => {
          getItemMetaSchema(metaData).then((metaSchema) => {
            setLoading(false);
            setMetaSchema(metaSchema);
          });
        })
        .catch(() => {
          setLoading(false);
        });
    }
  }, [modelPageCode]);

  return [metaSchema, loading];
};
