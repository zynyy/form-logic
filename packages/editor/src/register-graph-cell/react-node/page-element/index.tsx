import { MouseEvent } from "react";
import { Card, Button, Space, Popconfirm } from "antd";

import {
  PlusOutlined,
  QuestionCircleOutlined,
  DeleteOutlined,
  RedoOutlined,
} from "@ant-design/icons";
import StaticSelect from "@/components/static-select";

import {
  useCreateRightNode,
  useRefreshPageElement,
} from "@/hooks";
import CopyButton from "@/components/copy-button";

interface PageElementProps {
  node: any;
}

const PageElementSelect = ({ node }: PageElementProps) => {
  const [dataSource, handleRefreshClick] = useRefreshPageElement(
    node.model.graph
  );

  const btnRef = useCreateRightNode(node);

  const handleChange = (value: string) => {
    const { type, key } = dataSource.find((item) => item.code === value) || {};

    node.setData({ elementCode: key, elementTypeCode: type });
  };

  const handleClick = (e?: MouseEvent<HTMLElement>) => {
    node.model.graph.emit("node:addElementEvent", { e, node });
  };

  const { elementCode, elementTypeCode } = node.getData();

  const handleDeleteConfirm = (e?: MouseEvent<HTMLElement>) => {
    node.model.graph.emit("node:delete", { e, node });
  };

  return (
    <Card
      title="页面元素"
      extra={
        <Space>
          <Button
            type="primary"
            shape="circle"
            onClick={handleClick}
            ref={btnRef}
          >
            <PlusOutlined />
          </Button>

          <Popconfirm
            title="是否确定删除页面元素"
            icon={<QuestionCircleOutlined style={{ color: "red" }} />}
            onConfirm={handleDeleteConfirm}
          >
            <Button danger shape="circle">
              <DeleteOutlined />
            </Button>
          </Popconfirm>

          <Button shape="circle" onClick={handleRefreshClick}>
            <RedoOutlined />
          </Button>
          <CopyButton text={elementCode} />
        </Space>
      }
      className="model-page-card"
    >
      <StaticSelect
        value={
          elementTypeCode && elementCode
            ? `${elementCode}-${elementTypeCode}`
            : undefined
        }
        onChange={handleChange}
        data={dataSource}
      />
    </Card>
  );
};

export default PageElementSelect;
