import { Graph } from '@antv/x6';
import { LANE_NODE } from '@/utils/constant';

const registerLane = () => {
  Graph.registerNode(
    LANE_NODE,
    {
      inherit: 'rect',
      markup: [
        {
          tagName: 'rect',
          selector: 'body',
        },
        {
          tagName: 'rect',
          selector: 'name-rect',
        },
        {
          tagName: 'text',
          selector: 'name-text',
        },
      ],
      attrs: {
        body: {
          fill: '#FFF',
          stroke: '#5F95FF',
          strokeWidth: 1,
        },
        'name-rect': {
          width: 300,
          height: 30,
          fill: '#fff',
          stroke: '#5F95FF',
          strokeWidth: 1,
        },
        'name-text': {
          ref: 'name-rect',
          refY: 0.5,
          refX: 0.5,
          textAnchor: 'middle',
          fontWeight: 'bold',
          fill: 'rgba(0, 0, 0, 0.88)',
          fontSize: 12,
        },
      },
    },
    true,
  );
};

export default registerLane;
