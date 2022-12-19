import { Card, Button, Space, Popconfirm } from "antd";
import { MouseEvent } from "react";
import {
  PlusOutlined,
  QuestionCircleOutlined,
  DeleteOutlined,
  RedoOutlined,
} from "@ant-design/icons";
import StaticSelect from "../../../components/static-select";
import {
  useCreateRightNode,
  useRefreshElementEvent,
} from "@/hooks";
import CopyButton from "@/components/copy-button";

interface PageElementSelectProps {
  node: any;
}

const ElementEventSelect = ({ node }: PageElementSelectProps) => {
  const [dataSource, handleRefreshClick] = useRefreshElementEvent(
    node.model.graph
  );

  const btnRef = useCreateRightNode(node);

  const handleChange = (value: string) => {
    node.setData({ eventName: value });
  };

  const handleClick = (e: MouseEvent<HTMLElement>) => {
    node.model.graph.emit("node:addEventProcess", { e, node });
  };

  const handleDeleteConfirm = (e?: MouseEvent<HTMLElement>) => {
    node.model.graph.emit("node:delete", { e, node });
  };

  const { eventName } = node.getData();

  return (
    <Card
      title="元素事件"
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
            title="是否确定事件及流程"
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
          <CopyButton text={eventName} />
        </Space>
      }
      className="model-page-card"
    >
      <StaticSelect
        value={eventName}
        onChange={handleChange}
        data={dataSource}
      />
    </Card>
  );
};

export default ElementEventSelect;
