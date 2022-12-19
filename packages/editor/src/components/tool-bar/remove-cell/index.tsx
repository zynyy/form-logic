import {FC, useEffect, useRef, useState} from "react";
import {Space} from "antd";

import {DeleteOutlined} from "@ant-design/icons";

import {Cell, Graph} from "@antv/x6";

import BtnTooltipIcon from "../../../components/btn-tooltip-icon";
import {Keyboard} from "@antv/x6-plugin-keyboard";

interface RemoveCellProps {
  graph: Graph | undefined;
}

const RemoveCell: FC<RemoveCellProps> = ({ graph }) => {
  const [disabled, setDisabled] = useState(true);

  const selectedViewRef = useRef<Cell | undefined>(undefined);

  useEffect(() => {
    if (graph) {
      graph?.use(
        new Keyboard({
          enabled: true,
          global: true,
        })
      );

      graph?.bindKey(["backspace", "del"], () => {
        selectedViewRef.current?.remove();
      });

      graph?.on("cell:selected", ({ cell }) => {
        selectedViewRef.current = cell;

        if (cell.isEdge()) {
          cell.setAttrs({
            line: {
              stroke: "#1890ff",
              strokeDasharray: 5,
              targetMarker: "classic",
              style: {
                animation: "ant-line 30s infinite linear",
              },
            },
          });
        }

        setDisabled(false);
      });

      graph?.on("cell:unselected", ({ cell }) => {
        setDisabled(true);

        if (cell.isEdge()) {
          cell.setAttrs({
            line: {
              stroke: "#A2B1C3",
              strokeWidth: 2,
              strokeDasharray: 0,
              targetMarker: {
                name: "block",
                width: 12,
                height: 8,
              },
              style: {
                animation: "none",
              },
            },
          });
        }

        selectedViewRef.current = undefined;
      });
    }

    return () => {
      graph?.off("cell:selected", () => {});
      graph?.off("cell:unselected", () => {});
    };
  }, [graph]);

  const handleDeleteClick = () => {
    selectedViewRef.current?.remove();
  };

  return (
    <Space>
      <BtnTooltipIcon
        tooltip="删除选中"
        icon={<DeleteOutlined />}
        onClick={handleDeleteClick}
        disabled={disabled}
      />
    </Space>
  );
};

export default RemoveCell;
