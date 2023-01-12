import { Card, Space } from 'antd';

import { useCreateRightNode, useMode, useRefreshPageData } from '@/hooks';
import { CopyButton, PlusButton, StaticSelect } from '@formlogic/component';
import { Node } from '@antv/x6';

import ConfirmDeleteButton from '@/components/confirm-delete-button';

import { useDeleteConfirm, usePlusClick } from '@/register-graph-cell/react-node/hooks';

interface PageElementProps {
  node: Node;
}

const PageDataSelect = ({ node }: PageElementProps) => {
  const [dataSource] = useRefreshPageData(node.model.graph);

  const btnRef = useCreateRightNode(node);

  const [handleClick, showPlus] = usePlusClick(node);

  const handleChange = (value: string) => {
    const { type, code } =
      dataSource.find((item) => {
        return `${item.code}-${item.type}` === value;
      }) || {};

    node.setData({ fieldCode: code, fieldType: type });
  };

  const [handleDeleteConfirm] = useDeleteConfirm(node);

  const { fieldCode, fieldType } = node.getData();

  const { isEditable, isGridMode } = useMode();

  const value = fieldCode && fieldCode ? `${fieldCode}-${fieldType}` : undefined;

  const children = isEditable ? (
    <StaticSelect
      value={value}
      onChange={handleChange}
      data={dataSource}
      labelTemplateKey="{{name}}: {{code}}-{{type}}"
      valueTemplateKey="{{code}}-{{type}}"
      optionLabelProp="value"
      bordered={!isGridMode}
    />
  ) : (
    <span>{value}</span>
  );

  if (isGridMode) {
    return (
      <Card
        title={children}
        size="small"
        className="grid-mode-card"
        extra={<CopyButton text={fieldCode} />}
      />
    );
  }

  return (
    <Card
      title="页面字段"
      size="small"
      extra={
        <Space>
          {showPlus ? <PlusButton ref={btnRef} onClick={handleClick} /> : null}

          {isEditable ? (
            <>
              <ConfirmDeleteButton title="是否删除" onConfirm={handleDeleteConfirm} />
            </>
          ) : null}

          {
            fieldCode ?  <CopyButton text={fieldCode} /> : null
          }


        </Space>
      }
    >
      {children}
    </Card>
  );
};

export default PageDataSelect;
