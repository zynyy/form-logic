import { FC, useEffect, useMemo, useRef, useState } from 'react';

import { Tabs, Radio } from 'antd';

import { Layout, setMonacoEditorLoaderPath } from '@formlogic/component';

import { useSettingDrawerStyle } from '@/hooks';
import LogicTabs from './logic-tabs';

import ModelPageTabs from './model-page-tabs';
import SchemaData from './schema-data';
import ExecLogicHistory from './exec-logic-history';

import cls from 'classnames';

import '@/assets/css/App.css';
import { CheckboxGroupProps } from 'antd/es/checkbox';

setMonacoEditorLoaderPath({
  vs: '/monaco-editor/vs',
});

export enum TabsItemKey {
  modelPageConfig = 'modelPageConfig',
  logicList = 'logicList',
  options = 'options',
  execLogicHistory = 'execLogicHistory',
}

interface ChromeExtensionProps {
  connectionName: string;
}

const ChromeExtension: FC<ChromeExtensionProps> = ({ connectionName }) => {
  const [pageOptions, setPageOptions] = useState<CheckboxGroupProps['options']>([]);

  const [pageCode, setPageCode] = useState('');

  const [warpSSR, hashId, prefixCls] = useSettingDrawerStyle();

  const settingDataRef = useRef({});

  const [activeKey, setActiveKey] = useState(TabsItemKey.execLogicHistory);

  const pageConnection = useMemo(() => {
    return chrome.runtime.connect({
      name: connectionName || '@formlogic-devtools',
    });
  }, [connectionName]);

  const checkParentNode = (htmlNode: HTMLElement | null, checkClassName: string) => {
    if (htmlNode) {
      return htmlNode.className.includes(checkClassName)
        ? htmlNode
        : checkParentNode(htmlNode.parentElement, checkClassName);
    }

    return false;
  };

  const handleTabsChange = (nextActive) => {
    setActiveKey(nextActive);
  };

  const handleSuccess = () => {
    pageConnection.postMessage({
      name: 'reload',
    });
  };

  const handleChange = (e) => {
    setPageCode(e.target.value);
  };

  useEffect(() => {
    pageConnection.onMessage.addListener(({ type, settingData }) => {
      switch (type) {
        case 'init':
        case 'update': {
          settingDataRef.current = settingData;

          const nextPageOptions = Object.keys(settingData)
            .map((id) => {
              const { options } = settingData[id];

              const { metaSchema } = options;
              if (metaSchema) {
                const { code } = metaSchema;

                return {
                  label: code,
                  value: id,
                };
              }
            }, [])
            .filter((val) => val);

          setPageOptions(nextPageOptions);

          setPageCode((prevCode) => {
            let nextPageCode = prevCode;

            if (
              nextPageOptions.length &&
              !nextPageOptions.find((item) => item.value === prevCode)
            ) {
              nextPageCode = nextPageOptions[0].value;
            }

            return nextPageCode;
          });
          break;
        }
        default: {
          break;
        }
      }
    });
  }, []);

  const { options, execLogicList } = settingDataRef.current[pageCode] || {};

  const items = [
    {
      label: '执行逻辑历史',
      key: TabsItemKey.execLogicHistory,
      children: <ExecLogicHistory dataSource={execLogicList || []} />,
    },
    {
      label: '页面配置',
      key: TabsItemKey.modelPageConfig,
      children: (
        <ModelPageTabs
          onSuccess={handleSuccess}
          options={options}
          isActive={TabsItemKey.modelPageConfig === activeKey}
        />
      ),
    },
    {
      label: '页面逻辑',
      key: TabsItemKey.logicList,
      children: (
        <LogicTabs
          onSuccess={handleSuccess}
          options={options}
          isActive={TabsItemKey.logicList === activeKey}
        />
      ),
    },
    {
      label: '转换数据',
      key: TabsItemKey.options,
      children: <SchemaData value={options ? JSON.stringify(options, null, 2) : ''} />,
    },
  ];

  return warpSSR(
    <Layout>
      <Radio.Group
        value={pageCode}
        onChange={handleChange}
        buttonStyle="solid"
        options={pageOptions}
        optionType="button"
      />
      <Tabs
        activeKey={activeKey}
        onChange={handleTabsChange}
        style={{
          height: 'calc(100% - 30px)',
        }}
        centered
        items={items}
        type="card"
        size="small"
        className={cls(hashId, `${prefixCls}-tabs`)}
      />
    </Layout>,
  );
};

export default ChromeExtension;
