import { FC, PropsWithChildren, useEffect, useState } from 'react';
import { Card, Tabs } from 'antd';
import { useField, RecursionField, observer } from '@formily/react';
import FeedbackBadge from '@/components/feedback-badge';
import { usePropertiesSources } from '@/components/hooks';
import SchemaFragment from '@/components/schema-fragment';
import { useFormTabsGroupStyle } from '@/components/form-tabs-group/hooks';
import cls from 'classnames';

interface FormTabsGroupProps extends PropsWithChildren {
  activeKey?: string;
  onChange?: (activeKey: string) => void;
}

const useTabs = (tabsSources) => {
  const tabsField = useField();

  return tabsSources.reduce((tabs, cur) => {
    const { name, title, schema } = cur || {};

    const field = tabsField.query(tabsField.address.concat(name)).take();

    if (field?.display !== 'visible') {
      return tabs;
    }

    return tabs.concat({
      name,
      title,
      key: `${name}`,
      schema,
    });
  }, []);
};

const FormTabsGroup: FC<FormTabsGroupProps> = observer(({ activeKey: propActiveKey, onChange }) => {
  const tabsSources = usePropertiesSources();

  const tabs = useTabs(tabsSources);

  const defaultKey = `${tabs[0]?.key}`;

  const [warpSSR, hashId, prefixCls] = useFormTabsGroupStyle();

  const [activeKey, setActiveKey] = useState(() => {
    return defaultKey;
  });

  useEffect(() => {
    setActiveKey(propActiveKey);
  }, [propActiveKey]);

  const existIndex = tabs.findIndex((cur) => cur.key === activeKey);

  useEffect(() => {
    if (existIndex === -1) {
      setActiveKey(defaultKey);
    }
  }, [existIndex, defaultKey]);

  const handleChange = (nextActiveKey) => {
    setActiveKey(nextActiveKey);
    onChange?.(nextActiveKey);
  };

  return warpSSR(
    <div className={cls(prefixCls, hashId)}>
      <Tabs
        activeKey={activeKey}
        onChange={handleChange}
        type="card"
        items={tabs.map((item) => {
          const { schema, key, name, title } = item || {};
          return {
            key,
            label: <FeedbackBadge name={name}>{title}</FeedbackBadge>,
            forceRender: true,
            children: (
              <Card size="small" id={key}>
                <RecursionField schema={schema} name={name} onlyRenderProperties />
              </Card>
            ),
          };
        })}
      />

      <SchemaFragment schemaSource={tabsSources} />
    </div>,
  );
});

export default FormTabsGroup;
