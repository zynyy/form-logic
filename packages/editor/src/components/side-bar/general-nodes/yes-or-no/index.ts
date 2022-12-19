import { Graph } from '@antv/x6';
import { PortsPosition } from '../interface';
import { portsLeft, portsRight, portsTop } from '../ports';
import { getGraphId } from '@/utils';


const yesOrNoNode = (graph: Graph) => {
  return graph.createNode({
    id: getGraphId('yn'),
    shape: 'custom-polygon',
    attrs: {
      body: {
        refPoints: '0,10 10,0 20,10 10,20',
      },
    },
    label: '判断',
    data: {
      settingConfig: 'yesOrNo-config',
      codeEditor: true,
      configValues: {
        label: '判断',
      },
      validateRules: {
        inOut: true,
      },
      createEdgeConfig: {
        [PortsPosition.rightOut]: {
          portEdge: 'createNoEdge',
        },
        [PortsPosition.leftOut]: {
          portEdge: 'createYesEdge',
        },
      },
      templateCode: 'yesOrNoTemplate',
    },
    ports: {
      groups: {
        [PortsPosition.topIn]: portsTop,
        [PortsPosition.leftOut]: portsLeft,
        [PortsPosition.rightOut]: portsRight,
      },
      items: [
        {
          group: PortsPosition.topIn,
        },
        {
          group: PortsPosition.rightOut,
        },
        {
          group: PortsPosition.leftOut,
        },
      ],
    },
  });
};

export default yesOrNoNode;
