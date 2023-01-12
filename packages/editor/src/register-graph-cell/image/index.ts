import {Graph, Node} from "@antv/x6";
import { IMAGE_NODE } from '@/utils/constant';

const registerImage = (ports: Node["ports"]) => {
  Graph.registerNode(
    IMAGE_NODE,
    {
      inherit: "rect",
      width: 52,
      height: 52,
      markup: [
        {
          tagName: "rect",
          selector: "body",
        },
        {
          tagName: "image",
        },
        {
          tagName: "text",
          selector: "label",
        },
      ],
      attrs: {
        body: {
          stroke: "#5F95FF",
          fill: "#5F95FF",
        },
        image: {
          width: 26,
          height: 26,
          refX: 13,
          refY: 16,
        },
        label: {
          refX: 3,
          refY: 2,
          textAnchor: "left",
          textVerticalAnchor: "top",
          fontSize: 12,
          fill: "#fff",
        },
      },
      ports: { ...ports },
    },
    true
  );
};

export default registerImage;
