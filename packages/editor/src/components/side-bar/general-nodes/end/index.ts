import { Graph } from '@antv/x6';
import { PortsPosition } from '../interface';
import { portsLeft, portsTop } from '../ports';
import { getGraphId } from '@/utils';



const endNode = (graph: Graph) => {
  const { id } = graph.getNodes().find((item) => item.id.startsWith('end')) || {
    id: getGraphId('end'),
  };
  return graph.createNode({
    id,
    shape: 'custom-rect',
    label: '结束',
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
      templateCode: 'endTemplateCode',
    },
    ports: {
      groups: {
        [PortsPosition.leftIn]: portsLeft,
        [PortsPosition.topIn]: portsTop,
      },
      items: [
        {
          group: PortsPosition.leftIn,
        },
        {
          group: PortsPosition.topIn,
        },
      ],
    },
  });
};

export default endNode;
