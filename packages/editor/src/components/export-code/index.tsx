import {FC} from "react";
import {Button} from "antd";

import {Graph} from "@antv/x6";
import {CodeOutlined} from "@ant-design/icons";

import {compileCode, downloadZip} from "@/utils";


interface ExportCodeProps {
  graph: Graph;
}

const ExportCode: FC<ExportCodeProps> = ({ graph }) => {
  const handleClick = () => {
    const dsl = graph.toJSON();
    const nodes = graph.getNodes();

    const output = compileCode(dsl,nodes);

    downloadZip(output, "");
  };

  return (
    <Button onClick={handleClick} icon={<CodeOutlined />}>
      下载代码
    </Button>
  );
};

export default ExportCode;
