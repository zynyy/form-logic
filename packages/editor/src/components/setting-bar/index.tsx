import {createElement, FC, useEffect, useRef, useState} from "react";
import {Card, Empty} from "antd";
import {Cell, Graph} from "@antv/x6";
import {Selection} from "@antv/x6-plugin-selection";
import settingConfigs from "./configs";
import {SettingConfigTypeFC} from "./interface";

interface SettingBarProps {
  graph: Graph | undefined;
}

const SettingBar: FC<SettingBarProps> = ({ graph }) => {
  const [selected, setSelected] = useState<undefined | Cell>(undefined);

  const settingConfigRef = useRef<SettingConfigTypeFC>();

  useEffect(() => {
    if (graph) {
      graph.use(
        new Selection({
          enabled: true,
          strict: true,
          multiple: false,
          showNodeSelectionBox: true,
          showEdgeSelectionBox: true,
          pointerEvents: "none",
          rubberband: true,
        })
      );

      graph.on("cell:selected", ({ cell }) => {
        const { settingConfig } = cell.data || {};

        settingConfigRef.current = settingConfigs.getConfig(settingConfig);

        setSelected(cell);
      });

      graph.on("cell:unselected", ({}) => {
        settingConfigRef.current = undefined;
        setSelected(undefined);
      });
    }

    return () => {
      graph?.off("cell:selected");
      graph?.off("cell:unselected");
    };
  }, [graph]);

  const renderConfigView = () => {
    if (selected && settingConfigRef.current) {
      return createElement(settingConfigRef.current, {
        graph,
        selected,
      });
    }

    return (
      <Empty
        description={selected ? "选中的单元格无须配置" : "暂未发现选中的单元格"}
      />
    );
  };

  return (
    <Card title={selected ? `${selected.id}配置` : "请先选中单元格"}>
      {renderConfigView()}
    </Card>
  );
};

export default SettingBar;
