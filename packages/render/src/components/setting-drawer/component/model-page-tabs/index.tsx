import { TransformsSchemaOptions } from '@/transforms';
import { FC, useEffect, useState } from 'react';
import { Empty, Tabs } from 'antd';

import { MetaSchema } from '@/interface';
import { toArray } from '@/utils';

export interface ModelPageTabsProps {
  options: TransformsSchemaOptions;
}

const ModelPageTabs: FC<ModelPageTabsProps> = ({ options }) => {
  const [modelPages, setModelPages] = useState([]);

  const [activeKey, setActiveKey] = useState('');

  const getLogicEffectHook = (metaSchema: MetaSchema) => {
    const { code, model, data } = metaSchema;

    return {
      modelCode: model,
      pageCode: code,
      pageDataSource: data.map((item) => {
        const { name, code: fieldCode, type: fieldType } = item;
        return {
          code: fieldCode,
          type: fieldType,
          name,
        };
      }),
      logics: data.reduce((acc, item) => {
        const { logics, code: fieldCode, type: fieldType } = item;
        if (logics) {
          return acc.concat(
            logics.map((cur) => {
              const { effectHook, logicCode } = cur;
              return {
                fieldCode,
                fieldType,
                effectHook,
                logicCode,
              };
            }),
          );
        }

        return acc;
      }, []),
    };
  };

  const handleTabsChange = (nextActiveKey: string) => {
    setActiveKey(nextActiveKey);
  };

  useEffect(() => {
    if (options) {
      const { metaSchema } = options;
      if (metaSchema) {
        const { data } = metaSchema;

        const dataLogicEffectHook = toArray(data)
          .map((item) => {
            const { pageCode, itemMetaSchema } = item;

            if (pageCode && itemMetaSchema) {
              return getLogicEffectHook(itemMetaSchema);
            }
            return null;
          })
          .filter((val) => val);

        setModelPages([getLogicEffectHook(metaSchema)].concat(dataLogicEffectHook));

        setActiveKey(metaSchema.code);
      }
    }
  }, [options]);

  const items = modelPages.map((item) => {
    const { logics, modelCode, pageCode, pageDataSource } = item || {};

    return {
      label: pageCode,
      key: pageCode,
      children: null,
    };
  });

  return modelPages.length ? (
    <Tabs
      items={items}
      activeKey={activeKey}
      tabPosition="left"
      onChange={handleTabsChange}
      style={{
        height: '100%',
      }}
    />
  ) : (
    <Empty />
  );
};

export default ModelPageTabs;
