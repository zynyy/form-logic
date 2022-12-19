import { MouseEvent } from "react";
import { Card, Button, Popconfirm, Space } from "antd";

import {
  DeleteOutlined,
  QuestionCircleOutlined,
  RedoOutlined,
} from "@ant-design/icons";
import StaticSelect from "@/components/static-select";

import { useRefreshEventProcess } from "@/hooks";
import CopyButton from "@/components/copy-button";

interface PageElementSelectProps {
  node: any;
}

const EventProcessSelect = ({ node }: PageElementSelectProps) => {
  const [dataSource, handleRefreshClick] = useRefreshEventProcess(
    node.model.graph
  );

  const handleChange = (value: string) => {
    node.setData({ imoveProcessCode: value });
  };

  const handleDeleteConfirm = (e?: MouseEvent<HTMLElement>) => {
    node.model.graph.emit("node:delete", { e, node });
  };

  const { imoveProcessCode } = node.getData();

  return (
    <Card
      title="事件流程"
      extra={
        <Space>
          <Popconfirm
            title="是否确定删除流程"
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
          <CopyButton text={imoveProcessCode} />
        </Space>
      }
      className="model-page-card"
    >
      <StaticSelect
        value={imoveProcessCode}
        onChange={handleChange}
        data={dataSource}
      />
    </Card>
  );
};

export default EventProcessSelect;
