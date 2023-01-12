import { Space } from 'antd';
import ConnectStatus from '../connect-status';
import ExportCode from '@/components/export-code';
import { Graph } from '@antv/x6';
import ImportDSL from '@/components/import-dsl';
import { FC } from 'react';
import { useMode } from '@/hooks';

interface ExtraBtnProps {
  graph?: Graph;
}

const ExtraBtn: FC<ExtraBtnProps> = ({ graph }) => {
  const { isEditable } = useMode();

  return (
    <Space>
      <ExportCode graph={graph} />

      {isEditable ? (
        <>
          <ImportDSL graph={graph} />
          <ConnectStatus />
        </>
      ) : null}
    </Space>
  );
};

export default ExtraBtn;
