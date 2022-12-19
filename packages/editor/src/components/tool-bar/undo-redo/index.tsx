import {FC, useEffect, useState} from "react";
import {Space} from "antd";
import {RedoOutlined, UndoOutlined} from "@ant-design/icons";
import {History as x6History} from "@antv/x6-plugin-history";

import {Graph} from "@antv/x6";

import BtnTooltipIcon from "../../../components/btn-tooltip-icon";
import {Keyboard} from "@antv/x6-plugin-keyboard";

interface UndoRedoProps {
  graph: Graph | undefined;
}

const UndoRedo: FC<UndoRedoProps> = ({ graph }) => {
  const [redoDisabled, setRedoDisabled] = useState(true);
  const [undoDisabled, setUndoDisabled] = useState(true);

  useEffect(() => {
    if (graph) {
      graph.use(new x6History({ enabled: true }));

      graph.use(
        new Keyboard({
          enabled: true,
          global: true,
        })
      );

      graph.bindKey("meta + z", () => {
        handleUndoClick();
      });

      graph.bindKey("meta + shift + z", () => {
        handleRedoClick();
      });

      graph?.on("history:change", () => {
        setRedoDisabled(!graph.canRedo());
        setUndoDisabled(!graph.canUndo());
      });
    }

    return () => {};
  }, [graph]);

  const handleUndoClick = () => {
    graph?.undo();
  };

  const handleRedoClick = () => {
    graph?.redo();
  };

  return (
    <Space>
      <BtnTooltipIcon
        tooltip="撤销: 快捷键 meta + z"
        icon={<UndoOutlined />}
        onClick={handleUndoClick}
        disabled={undoDisabled}
      />
      <BtnTooltipIcon
        tooltip="重做：快捷键 meta + shift + z"
        icon={<RedoOutlined />}
        onClick={handleRedoClick}
        disabled={redoDisabled}
      />
    </Space>
  );
};

export default UndoRedo;
