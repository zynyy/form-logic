import { Graph } from '@antv/x6';
import { PortsPosition } from '../interface';
import { portsBottom, portsRight } from '../ports';
import { getGraphId } from '@/utils';
import { RECT_NODE } from '@/utils/constant';


const startNode = (graph: Graph) => {
  const { id } = graph.getNodes().find((item) => item.id.startsWith('start')) || {
    id: getGraphId('start'),
  };

  return graph.createNode({
    id,
    shape: RECT_NODE,
    label: '开始',
    attrs: {
      body: {
        rx: 20,
        ry: 26,
      },
    },
    data: {
      validateRules: {
        inOut: true,
      },
      templateCode: 'startTemplateCode',
    },
    ports: {
      groups: {
        [PortsPosition.rightOut]: portsRight,
        [PortsPosition.bottomOut]: portsBottom,
      },
      items: [
        {
          group: PortsPosition.rightOut,
        },
        {
          group: PortsPosition.bottomOut,
        },
      ],
    },
  });
};

export default startNode;
