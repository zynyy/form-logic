import {Graph, Node} from "@antv/x6";
import { CIRCLE_NODE } from '@/utils/constant';

const registerCircle = (ports: Node["ports"]) => {
  Graph.registerNode(
    CIRCLE_NODE,
    {
      inherit: "circle",
      width: 45,
      height: 45,
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
      ports: { ...ports },
    },
    true
  );
};

export default registerCircle
