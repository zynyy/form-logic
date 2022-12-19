import {FC} from "react";
import {Space} from "antd";


import {LayoutOutlined} from "@ant-design/icons";

import {Graph} from "@antv/x6";

import BtnTooltipIcon from "@/components/btn-tooltip-icon";

interface OneLayoutProps {
  graph: Graph | undefined;
}

const OneLayout: FC<OneLayoutProps> = ({ graph }) => {
  const handleLayoutClick = () => {
    if (graph) {
      graph.zoomToFit({ padding: 10, maxScale: 1 });
    }
  };

  return (
    <Space>
      <BtnTooltipIcon
        tooltip="自动调整布局"
        icon={<LayoutOutlined />}
        onClick={handleLayoutClick}
      />
    </Space>
  );
};

export default OneLayout;
