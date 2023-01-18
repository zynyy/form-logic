import { SaveOutlined, SettingOutlined } from '@ant-design/icons';
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
import { CloseButton, LeftRightSlot, Portal } from '@formlogic/component';
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
  renderDone: boolean;
}

const SettingDrawer: FC<SettingDrawerProps> = ({ form, renderDone }) => {
  const [open, show, hidden] = useOpen();

  const [reload, setReload] = useState(false);

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
    if (form?.id && renderDone) {
      setPortalContainer(getPortalContainer());
    }
  }, [form?.id, renderDone]);

  const handleLogicPatternChange = (pattern) => {
    setShowSaveBtn(pattern === ChartPattern.EDITABLE);
  };

  const handleTabsChange = (nextActive) => {
    setActiveKey(nextActive);
    setShowSaveBtn(false);
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

    setReload(true);
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

  const handleClose = () => {
    hidden();
    if (reload) {
      history.go(0);
    }
  };

  const items = [
    {
      label: '页面配置',
      key: TabsItemKey.modelPageConfig,
      children: (
        <ModelPageTabs options={options} isActive={TabsItemKey.modelPageConfig === activeKey} />
      ),
    },
    {
      label: '页面逻辑',
      key: TabsItemKey.logicList,
      children: (
        <LogicTabs
          options={options}
          ref={logicTabsRef}
          onPatternChange={handleLogicPatternChange}
          isActive={TabsItemKey.logicList === activeKey}
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
        <Portal open={renderDone} getContainer={portalContainer}>
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
                <CloseButton onClick={handleClose} />
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
                    type="primary"
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
          className={cls(hashId, `${prefixCls}-tabs`)}
        />
      </Drawer>
    </>,
  );
};

export default SettingDrawer;
