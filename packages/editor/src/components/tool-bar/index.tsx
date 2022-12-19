import { FC } from 'react';

import { Divider, Space } from 'antd';

import { Graph } from '@antv/x6';

import Save, { SaveProps } from './save';
import Zoom from './zoom';
import UndoRedo from './undo-redo';
import ExportImg from './export-img';
import RemoveCell from './remove-cell';

interface ToolBarProps extends SaveProps {
  graph: Graph | undefined;
}

const ToolBar: FC<ToolBarProps> = ({ graph, saveParams }) => {
  return (
    <Space split={<Divider type="vertical" />}>
      <Save graph={graph} saveParams={saveParams} />
      <UndoRedo graph={graph} />
      <Zoom graph={graph} />
      <RemoveCell graph={graph} />
      <ExportImg graph={graph} />
    </Space>
  );
};

export default ToolBar;
