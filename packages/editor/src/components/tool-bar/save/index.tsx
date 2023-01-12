import { FC } from 'react';
import { SaveOutlined } from '@ant-design/icons';

import { Graph } from '@antv/x6';
import { localSave } from '@/service';
import { Button, FormInstance, message, Popconfirm } from 'antd';
import { getFiles } from '@/utils';

interface SaveParams {
  [key: string]: any;
}

export interface SaveProps {
  graph: Graph | undefined;
  saveParams: SaveParams;
  form: FormInstance;
}

const Save: FC<SaveProps> = ({ graph, saveParams, form }) => {
  const handleSave = () => {
    const nodes = graph.getNodes();

    const files = getFiles(nodes);

    const dsl = graph.toJSON();

    const { cells } = dsl || {};

    const isLegal =
      cells.filter((item) => {
        const { id } = item || {};
        return id?.startsWith('start') || id?.startsWith('end');
      }).length === 2;

    if (isLegal) {

      form.validateFields().then((formValues) => {
        const { suffix, before } = formValues || {};

        localSave({
          dsl,
          files,
          ...saveParams,
          ...formValues,
          code: `${before}${suffix}`,
        }).then(() => {
          message.success('保存成功').then(() => void 0);
          history.back();
        });
      }).catch(err => {
        console.error(err)
      });
    } else {
      message.warning('无法找到开始节点和结束节点').then(() => void 0);
    }
  };

  return (
    <Popconfirm title="是否确定保存" onConfirm={handleSave}>
      <Button icon={<SaveOutlined />} type="text" />
    </Popconfirm>
  );
};

export default Save;
