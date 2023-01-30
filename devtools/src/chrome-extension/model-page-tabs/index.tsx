import {
  TransformsSchemaOptions,
  MetaSchema,
  FormPageLayout,
  useJsonMetaSchema,
} from '@formlogic/render';
import { FC, useEffect, useState } from 'react';
import { Empty, Tabs } from 'antd';
import { toArray } from '@formlogic/component';
import getLogicConfig from '@/low-code-meta/logic';
import { components } from './components';
import { apiUrl } from '@/service';
import { useModelPageDetail } from '@/hooks';

export interface ModelPageTabsProps {
  options: TransformsSchemaOptions;
  isActive: boolean;
  onSuccess?: () => void;
}

const ModelPageTabs: FC<ModelPageTabsProps> = ({ options, onSuccess }) => {
  const [modelPages, setModelPages] = useState([]);

  const [activeKey, setActiveKey] = useState('');

  const { metaSchema } = useJsonMetaSchema('ModelPage_U');

  const [formConfig, loading] = useModelPageDetail(activeKey);

  const getLogicEffectHook = (metaSchema: MetaSchema) => {
    const { code, model } = metaSchema;

    return {
      modelCode: model,
      pageCode: code,
    };
  };

  const handleTabsChange = (nextActiveKey: string) => {
    setActiveKey(nextActiveKey);
  };

  const successCallback = () => {
    onSuccess?.();
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
    const { pageCode } = item || {};

    return {
      label: pageCode,
      key: pageCode,
      children:
        activeKey === pageCode ? (
          <FormPageLayout
            loading={loading}
            hasBackBtn={false}
            hasGroup
            metaSchema={metaSchema}
            getLogicConfig={getLogicConfig}
            components={components}
            formConfig={formConfig}
            extraLogicParams={{
              successCallback,
              action: apiUrl.modelPageUpdate,
              extraParams: {},
            }}
          />
        ) : null,
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
