import { Card, Space } from 'antd';

import { Node } from '@antv/x6';
import {PlusButton} from '@formlogic/component';

import { useDeleteConfirm, usePlusClick } from '@/register-graph-cell/react-node/hooks';
import { useMode } from '@/hooks';
import ConfirmDeleteButton from '@/components/confirm-delete-button';

interface ModelPageSelectTableProps {
  node: Node;
}

const ModelPage = ({ node }: ModelPageSelectTableProps) => {
  const [handleClick, showPlus] = usePlusClick(node);

  const { pageCode, index } = node.getData();

  const { isGridMode, isEditable } = useMode();

  const [handleDeleteConfirm] = useDeleteConfirm(node);

  const children = <span>{pageCode}</span>;

  if (isGridMode) {
    return (
      <Card
        size="small"
        title={
          <Space>
            <span>{index + 1}</span>
            {children}
          </Space>
        }
        className="grid-mode-card"
        extra={
          <Space>
            {showPlus && index === 0 ? <PlusButton onClick={handleClick} /> : null}

            {isEditable && index !== 0 ? (
              <ConfirmDeleteButton title="是否删除" onConfirm={handleDeleteConfirm} />
            ) : null}
          </Space>
        }
      />
    );
  }

  return (
    <Card
      size="small"
      title="页面编码"
      extra={<Space>{showPlus ? <PlusButton onClick={handleClick} /> : null}</Space>}
    >
      {children}
    </Card>
  );
};

export default ModelPage;
