import { CloseOutlined, SaveOutlined, SettingOutlined } from '@ant-design/icons';
import { useOpen } from '@/hooks';
import { useSettingDrawerStyle } from '@/components/setting-drawer/hooks';
import { Alert, Button, Drawer, DrawerProps, Space, Tabs } from 'antd';
import { FC, useEffect, useRef, useState } from 'react';

import { ChartPattern } from '@formlogic/editor';

import cls from 'classnames';

import ExecLogicHistory from '@/components/setting-drawer/component/exec-logic-history';
import SchemaData from '@/components/setting-drawer/component/schema-data';
import LogicTabs, { LogicTabsRef } from '@/components/setting-drawer/component/logic-tabs';
import ModelPageTabs from '@/components/setting-drawer/component/model-page-tabs';
import { LeftRightSlot, Portal } from '@formlogic/component';
import { Form, isForm } from '@formily/core';

import { onExecLogicDone, onTransformOptionsChange } from '@/effect-hook';

export enum TabsItemKey {
  modelPageConfig = 'modelPageConfig',
  logicList = 'logicList',
  options = 'options',
  execLogicHistory = 'execLogicHistory',
}

export interface SettingDrawerProps extends DrawerProps {
  form: Form;
}

const SettingDrawer: FC<SettingDrawerProps> = ({ form }) => {
  const [open, show, hidden] = useOpen();

  const [warpSSR, hashId, prefixCls] = useSettingDrawerStyle();

  const [portalContainer, setPortalContainer] = useState<HTMLElement>();

  const [showSaveBtn, setShowSaveBtn] = useState(false);
  const [options, setOptions] = useState();

  const [activeKey, setActiveKey] = useState(TabsItemKey.modelPageConfig);

  const [loading, setLoading] = useState(false);

  const [execLogicHistory, setExecLogicHistory] = useState([]);

  const logicTabsRef = useRef<LogicTabsRef>();

  const checkParentNode = (htmlNode: HTMLElement | null, checkClassName: string) => {
    if (htmlNode) {
      return htmlNode.className.includes(checkClassName)
        ? htmlNode
        : checkParentNode(htmlNode.parentElement, checkClassName);
    }

    return false;
  };

  const getPortalContainer = () => {
    const formId = form.id;
    const modalNode = document.querySelector(`.ant-modal-content .form-id-${formId}`);
    const drawerNode = document.querySelector(`.ant-drawer-content .form-id-${formId}`);

    if (modalNode) {
      return checkParentNode(modalNode.parentElement, 'ant-modal-content');
    } else if (drawerNode) {
      return checkParentNode(drawerNode.parentElement, 'ant-drawer-content');
    }
    return document.body;
  };

  useEffect(() => {
    if (form?.id) {
      setPortalContainer(getPortalContainer());
    }
  }, [form?.id]);

  const handleLogicPatternChange = (pattern) => {
    setShowSaveBtn(pattern === ChartPattern.EDITABLE);
  };

  const handleTabsChange = (nextActive) => {
    setActiveKey(nextActive);
  };

  const handleSaveClick = () => {
    if (activeKey === TabsItemKey.logicList) {
      if (logicTabsRef.current) {
        setLoading(true);
        logicTabsRef.current.updateLogic(() => {
          setLoading(false);
        });
      }
    }
  };

  useEffect(() => {
    const effectId = 'setting';

    form?.addEffects(effectId, () => {
      onExecLogicDone((payload) => {
        if (!isForm(payload)) {
          setExecLogicHistory((prevExecLogicHistory) => {
            return payload.concat(prevExecLogicHistory);
          });
        }
      });

      onTransformOptionsChange((payload) => {
        if (!isForm(payload)) {
          setOptions(payload);
        }
      });
    });

    return () => {
      form?.removeEffects(effectId);
    };
  }, [form?.id]);

  const handleClick = () => {
    show();
  };

  const items = [
    {
      label: '页面配置',
      key: TabsItemKey.modelPageConfig,
      children: <ModelPageTabs options={options} />,
    },
    {
      label: '页面逻辑',
      key: TabsItemKey.logicList,
      children: (
        <LogicTabs
          options={options}
          ref={logicTabsRef}
          onPatternChange={handleLogicPatternChange}
        />
      ),
    },
    {
      label: '转换数据',
      key: TabsItemKey.options,
      children: <SchemaData value={options ? JSON.stringify(options, null, 2) : ''} />,
    },
    {
      label: '执行逻辑历史',
      key: TabsItemKey.execLogicHistory,
      children: <ExecLogicHistory dataSource={execLogicHistory} />,
    },
  ];

  return warpSSR(
    <>
      {portalContainer ? (
        <Portal open getContainer={portalContainer}>
          <div className={cls(`${prefixCls}-handle`, hashId)} onClick={handleClick}>
            <SettingOutlined />
          </div>
        </Portal>
      ) : null}

      <Drawer
        title={<Alert type="info" message="快捷配置只在开发环境展现，生产环境不会展现" />}
        open={open}
        width="90%"
        maskClosable={false}
        closable={false}
        destroyOnClose
        footer={
          <LeftRightSlot
            left={
              <Space>
                <Button icon={<CloseOutlined />} onClick={hidden}>
                  关闭
                </Button>
              </Space>
            }
            right={
              showSaveBtn ? (
                <Space>
                  <Button
                    loading={loading}
                    disabled={loading}
                    icon={<SaveOutlined />}
                    onClick={handleSaveClick}
                  >
                    保存
                  </Button>
                </Space>
              ) : null
            }
          />
        }
      >
        <Tabs
          activeKey={activeKey}
          onChange={handleTabsChange}
          style={{
            height: '100%',
          }}
          centered
          items={items}
          type="card"
          size="small"
          className="setting-drawer-tabs"
        />
      </Drawer>
    </>,
  );
};

export default SettingDrawer;
