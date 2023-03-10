import {Graph, Node} from "@antv/x6";
import { POLYGON_NODE } from '@/utils/constant';

const registerPolygon = (ports: Node["ports"]) => {
  Graph.registerNode(
    POLYGON_NODE,
    {
      inherit: "polygon",
      width: 66,
      height: 36,
      attrs: {
        body: {
          strokeWidth: 1,
          stroke: "#5F95FF",
          fill: "#EFF4FF",
        },
        text: {
          fontSize: 12,
          fill: "#262626",
        },
      },
      ports: {
        ...ports,
        items: [
          {
            group: "top",
          },
          {
            group: "bottom",
          },
        ],
      },
    },
    true
  );
};

export default registerPolygon;
