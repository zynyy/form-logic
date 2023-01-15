import { FC, useEffect, useState } from 'react';
import { Drawer, DrawerProps, message, Tabs } from 'antd';
import CopyPageConfig from '@/pages/development/model-page/component/copy-model-page-drawer/page';
import { modelPageDetail } from '@/pages/development/model-page/services';

import { debounce } from 'lodash-es';
import CopyGroupPageConfig from '@/pages/development/model-page/component/copy-model-page-drawer/group';
import CreateCopyPageConfig from '@/pages/development/model-page/component/copy-model-page-drawer/create';
import FieldCopyPageConfig from '@/pages/development/model-page/component/copy-model-page-drawer/field';
import { CloseButton, LeftRightSlot } from '@formlogic/component';

interface CopyModelPageDrawer extends DrawerProps {
  pageCode: string;
}

const CopyModelPageDrawer: FC<CopyModelPageDrawer> = ({ pageCode, open, onClose }) => {
  const [activeKey, setActiveKey] = useState('page');

  const [pageConfig, setPageConfig] = useState<DynamicObjectAny>({});
  const [copyPageConfig, setCopyPageConfig] = useState<DynamicObjectAny>({});

  const [copyPageCode, setCopyPageCode] = useState('');

  const fetchCopyPageConfigDetail = (pageCode: string) => {
    modelPageDetail({
      pageCode,
    })
      .then((res) => {
        const { data } = res;

        setCopyPageConfig(data);
      })
      .catch(() => {
        message.warning(`当前页面编码: ${pageCode} 不存在无法复制`).then(() => void 0);
      });
  };

  const fetchPageConfigDetail = (pageCode: string) => {
    modelPageDetail({
      pageCode,
    })
      .then((res) => {
        const { data } = res as any;

        setPageConfig(data);
      })
      .catch(() => {
        message.warning(`当前页面编码: ${pageCode} 不存在无法复制`).then(() => void 0);
      });
  };

  const handlePageChange = debounce((pageCode: string) => {
    fetchPageConfigDetail(pageCode);
  }, 1000);

  const handleCopyPageChange = debounce((copyCode: string) => {
    fetchCopyPageConfigDetail(copyCode);
    setCopyPageCode(copyCode);
  }, 1000);

  const handleTabsChange = (active: string) => {
    setActiveKey(active);
  };

  useEffect(() => {
    if (pageCode && open) {
      handlePageChange(pageCode);
    }
  }, [pageCode, open]);

  const items = [
    {
      key: 'page',
      label: '页面复制',
      children: (
        <CopyPageConfig
          onCopyPageChange={handleCopyPageChange}
          pageCode={pageCode}
          modelCode={pageConfig.model}
          fetchPageConfigDetail={fetchPageConfigDetail}
        />
      ),
    },
    {
      key: 'group',
      label: '分组复制',
      children: (
        <CopyGroupPageConfig
          pageConfig={pageConfig}
          copyPageConfig={copyPageConfig}
          onPageChange={handlePageChange}
          onCopyPageChange={handleCopyPageChange}
          fetchPageConfigDetail={fetchPageConfigDetail}
          copyPageCode={copyPageCode}
          pageCode={pageCode}
        />
      ),
    },
    {
      key: 'field',
      label: '字段复制',
      children: (
        <FieldCopyPageConfig
          pageConfig={pageConfig}
          copyPageConfig={copyPageConfig}
          onPageChange={handlePageChange}
          onCopyPageChange={handleCopyPageChange}
          fetchPageConfigDetail={fetchPageConfigDetail}
          copyPageCode={copyPageCode}
          pageCode={pageCode}
        />
      ),
    },
    {
      key: 'create',
      label: '新增页面',
      children: <CreateCopyPageConfig pageCode={pageCode} modelCode={pageConfig.model} />,
    },
  ];

  return (
    <Drawer
      width="90%"
      open={open}
      onClose={onClose}
      closable={false}
      maskClosable={false}
      title="复制页面配置类型"
      footer={<LeftRightSlot left={<CloseButton onClick={onClose} />} />}
    >
      <Tabs
        tabPosition="left"
        activeKey={activeKey}
        onChange={handleTabsChange}
        tabBarGutter={12}
        items={items}
      />
    </Drawer>
  );
};

export default CopyModelPageDrawer;
