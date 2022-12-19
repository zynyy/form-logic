import { FC } from 'react';
import { SaveOutlined } from '@ant-design/icons';

import { Graph } from '@antv/x6';
import { localSave } from '@/service';
import { Button, message, Popconfirm } from 'antd';
import { getFiles } from '@/utils';

interface SaveParams {
  code: string;
  pageCode?: string;
  [key: string]: any;
}

export interface SaveProps {
  graph: Graph | undefined;
  saveParams: SaveParams;
}

const Save: FC<SaveProps> = ({ graph, saveParams }) => {
  const handleSave = () => {
    const nodes = graph.getNodes();

    const files = getFiles(nodes);

    const dsl = graph.toJSON();

    localSave({
      dsl,
      files,
      ...saveParams,
    }).then((res) => {
      message.success('保存成功').then(() => void 0);
    });
  };

  return (
    <Popconfirm title="是否确定保存" onConfirm={handleSave}>
      <Button icon={<SaveOutlined />} type="text" />
    </Popconfirm>
  );
};

export default Save;
