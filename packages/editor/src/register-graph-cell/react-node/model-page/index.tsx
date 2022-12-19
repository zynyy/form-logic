import { useMemo, MouseEvent } from "react";

import { Card, Button } from "antd";

import { PlusOutlined } from "@ant-design/icons";

import SelectTable from "../../../components/select-table";
import "./style/index.css";
import { DataApiConfig } from "../../../service";

const selectTableColumns = [
  {
    title: "编码",
    key: "code",
    dataIndex: "code",
  },
  {
    title: "名称",
    key: "name",
    dataIndex: "name",
  },
];

interface ModelPageSelectTableProps {
  node: any;
}

const ModelPageSelectTable = ({ node }: ModelPageSelectTableProps) => {
  const handleChange = (value: string, record: any) => {
    const { name } = record || {};

    node.updateData({ pageCode: value, pageName: name });

    node.model.graph.emit("modelPageChange", {
      value,
      pageCode: value,
      pageName: name,
    });
  };

  const api = useMemo<DataApiConfig>(() => {
    return {
      method: "post",
      params: {
        pageNo: 1,
        pageSize: 5,
        queryKeys: {
          name: "",
        },
      },
      url: "/mof/pageConfig/page",
    };
  }, []);

  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    node.model.graph.emit("node:addPageElement", { e, node });
  };

  const { pageCode, disabled } = node.getData();

  return (
    <Card
      title="页面编码"
      extra={
        <Button
          type="primary"
          disabled={!pageCode}
          shape="circle"
          onClick={handleClick}
        >
          <PlusOutlined />
        </Button>
      }
      className="model-page-card"
    >
      <SelectTable
        value={pageCode}
        disabled={disabled}
        columns={selectTableColumns}
        keywordKey="queryKeys.code"
        labelTemplateKey="name"
        api={api}
        onChange={handleChange}
        allowClear={false}
      />
    </Card>
  );
};

export default ModelPageSelectTable;
