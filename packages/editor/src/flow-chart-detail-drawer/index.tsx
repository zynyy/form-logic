import { Drawer, DrawerProps, Space } from 'antd';
import FlowChartEditor from '@/flow-chart-editor';
import { CloseButton } from '@formlogic/component';

import { FC, useMemo } from 'react';
import { ChartPattern } from '@/interface';

export interface FlowChartDetailDrawerProps extends DrawerProps {
  logicCode: string;
}

const FlowChartDetailDrawer: FC<FlowChartDetailDrawerProps> = ({ logicCode, open, onClose }) => {
  const belongCode = useMemo(() => {
    return logicCode?.startsWith('com_') ? '' : logicCode;
  }, [logicCode]);

  return (
    <Drawer
      open={open}
      title={`${logicCode} 流程详情`}
      onClose={onClose}
      maskClosable={false}
      closable={false}
      width="90%"
      footer={
        <Space>
          <CloseButton onClick={onClose} />
        </Space>
      }
    >
      <FlowChartEditor
        pattern={ChartPattern.DETAIL}
        logicProcessConfig={{
          code: logicCode,
          belongCode,
        }}
      />
    </Drawer>
  );
};

export default FlowChartDetailDrawer;
