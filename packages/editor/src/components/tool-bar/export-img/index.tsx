import {FileJpgOutlined} from "@ant-design/icons";

import BtnTooltipIcon from "../../../components/btn-tooltip-icon";
import {FC, useEffect} from "react";
import {Export} from "@antv/x6-plugin-export";
import {Graph} from "@antv/x6";

interface SaveProps {
  graph: Graph | undefined;
}

const ExportImg: FC<SaveProps> = ({ graph }) => {
  const handleJpg = () => {
    graph?.exportJPEG();
  };

  useEffect(() => {
    graph?.use(new Export());
  }, [graph]);

  return (
    <BtnTooltipIcon
      tooltip="导出图片"
      icon={<FileJpgOutlined />}
      onClick={handleJpg}
    />
  );
};

export default ExportImg;
