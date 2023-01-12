import { Card, Space } from 'antd';

import { useCreateRightNode, useDownUp, useMode, useRefreshLogicProcess } from '@/hooks';

import { Node } from '@antv/x6';

import ConfirmDeleteButton from '@/components/confirm-delete-button';

import { useDeleteConfirm, usePlusClick } from '@/register-graph-cell/react-node/hooks';

import {
  PlusButton,
  DetailButton,
  DownButton,
  UpButton,
  CopyButton,
  StaticSelect,
} from '@formlogic/component';

import { LOGIC_PROCESS_DETAIL_GRAPH_EVENT } from '@/utils/constant';

interface LogicProcessSelectProps {
  node: Node;
}

const LogicProcess = ({ node }: LogicProcessSelectProps) => {
  const [dataSource] = useRefreshLogicProcess(node.model.graph);

  const btnRef = useCreateRightNode(node);

  const { upShow, downShow, down, up } = useDownUp(node);

  const [handleClick, showPlus] = usePlusClick(node);

  const handleChange = (value: string) => {
    node.setData({ logicCode: value });
  };

  const [handleDeleteConfirm] = useDeleteConfirm(node);

  const handleDetailClick = () => {
    node.model.graph.trigger(LOGIC_PROCESS_DETAIL_GRAPH_EVENT, { logicCode });
  };

  const { logicCode } = node.getData();

  const { isEditable, isGridMode } = useMode();

  const children = isEditable ? (
    <StaticSelect
      labelTemplateKey="{{code}}-{{name}}"
      optionLabelProp="value"
      value={logicCode}
      onChange={handleChange}
      data={dataSource}
      bordered={!isGridMode}
    />
  ) : (
    <span>{logicCode}</span>
  );

  if (isGridMode) {
    return (
      <Card
        size="small"
        className="grid-mode-card"
        title={children}
        extra={
          <Space>
            {logicCode ? <DetailButton onClick={handleDetailClick} /> : null}
            <CopyButton text={logicCode} />
          </Space>
        }
      />
    );
  }

  return (
    <Card
      title="逻辑流程"
      size="small"
      extra={
        <Space>
          {logicCode ? <DetailButton onClick={handleDetailClick} /> : null}
          {downShow ? <DownButton onClick={down} /> : null}
          {upShow ? <UpButton onClick={up} /> : null}
          {showPlus ? <PlusButton onClick={handleClick} ref={btnRef} /> : null}
          {isEditable ? (
            <ConfirmDeleteButton title="是否删除" onConfirm={handleDeleteConfirm} />
          ) : null}
          {logicCode ? <CopyButton text={logicCode} /> : null}
        </Space>
      }
    >
      {children}
    </Card>
  );
};

export default LogicProcess;
