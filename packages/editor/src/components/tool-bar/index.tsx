import { FC } from 'react';

import { Divider, Space } from 'antd';

import { Graph } from '@antv/x6';

import Save, { SaveProps } from './save';
import Zoom from './zoom';
import UndoRedo from './undo-redo';
import ExportImg from './export-img';
import RemoveCell from './remove-cell';
import { useMode } from '@/hooks';

interface ToolBarProps extends SaveProps {
  graph: Graph | undefined;
}

const ToolBar: FC<ToolBarProps> = ({ graph, saveParams, form }) => {
  const { isEditable } = useMode();

  return (
    <Space split={<Divider type="vertical" />}>
      {isEditable ? <Save graph={graph} saveParams={saveParams} form={form} /> : null}

      {isEditable ? <UndoRedo graph={graph} /> : null}

      <Zoom graph={graph} />

      {isEditable ? <RemoveCell graph={graph} /> : null}

      <ExportImg graph={graph} />
    </Space>
  );
};

export default ToolBar;
