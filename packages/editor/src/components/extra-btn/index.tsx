import { Space } from 'antd';
import ConnectStatus from '../connect-status';
import ExportCode from '@/components/export-code';
import { Graph } from '@antv/x6';
import ImportDSL from '@/components/import-dsl';
import { FC } from 'react';

interface ExtraBtnProps {
  graph?: Graph;
}

const ExtraBtn: FC<ExtraBtnProps> = ({ graph }) => {
  return (
    <Space>
      <ExportCode graph={graph} />

      <ImportDSL graph={graph} />

      <ConnectStatus />
    </Space>
  );
};

export default ExtraBtn;
