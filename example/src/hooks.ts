import { useEffect, useState } from 'react';
import { getModelPagePath } from '@/utils/utils';

export const useOpen = (tip: string): [boolean, () => void, () => void] => {
  const [open, setOpen] = useState(() => {
    return false;
  });

  const show = () => {
    console.log(tip, 'show');
    setOpen(true);
  };

  const hidden = () => {
    console.log(tip, 'hidden');
    setOpen(false);
  };

  useEffect(() => {
    console.log(`${tip}状态${open}`);
  }, [open, tip]);

  return [open, show, hidden];
};

const getJson = (pageCode) => {
  return fetch(getModelPagePath(pageCode)).then((res) => {
    return res.json();
  });
};

export const useMetaSchema = (modelPageCode: string) => {
  const [metaSchema, setMetaSchema] = useState(null);

  useEffect(() => {
    if (modelPageCode) {
      getJson(modelPageCode).then(async (metaData) => {
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
          setMetaSchema(metaData);
        }
      });
    }
  }, [modelPageCode]);

  return metaSchema;
};
