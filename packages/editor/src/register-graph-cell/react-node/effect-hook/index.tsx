import { Card, Space } from 'antd';

import { useCreateRightNode, useMode, useRefreshEffectHook } from '@/hooks';

import { Node } from '@antv/x6';
import ConfirmDeleteButton from '@/components/confirm-delete-button';

import { CopyButton, PlusButton, StaticSelect } from '@formlogic/component';

import { useDeleteConfirm, usePlusClick } from '@/register-graph-cell/react-node/hooks';

interface PageElementSelectProps {
  node: Node;
}

const EffectHook = ({ node }: PageElementSelectProps) => {
  const btnRef = useCreateRightNode(node);

  const [dataSource] = useRefreshEffectHook(node.model.graph);
  const [handleClick, showPlus] = usePlusClick(node);

  const handleChange = (value: string) => {
    node.setData({ effectHook: value });
  };

  const [handleDeleteConfirm] = useDeleteConfirm(node);

  const { effectHook } = node.getData();

  const { isEditable, isGridMode } = useMode();

  const children = isEditable ? (
    <StaticSelect
      value={effectHook}
      onChange={handleChange}
      data={dataSource}
      optionLabelProp="value"
      labelTemplateKey="{{code}}-{{name}}"
      bordered={!isGridMode}
    />
  ) : (
    <span>{effectHook}</span>
  );

  if (isGridMode) {
    return (
      <Card
        size="small"
        title={children}
        className="grid-mode-card"
        extra={<CopyButton text={effectHook} />}
      />
    );
  }

  return (
    <Card
      title="字段事件"
      size="small"
      extra={
        <Space>
          {isEditable ? (
            <>
              {showPlus ? <PlusButton onClick={handleClick} ref={btnRef} /> : null}

              <ConfirmDeleteButton title="是否删除" onConfirm={handleDeleteConfirm} />
            </>
          ) : null}

          {effectHook ? <CopyButton text={effectHook} /> : null}
        </Space>
      }
    >
      {children}
    </Card>
  );
};

export default EffectHook;
