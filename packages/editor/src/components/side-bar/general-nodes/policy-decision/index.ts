import { Graph } from '@antv/x6';
import { PortsPosition } from '../interface';
import { portsBottom, portsLeft, portsRight, portsTop } from '../ports';
import { getGraphId } from '@/utils';
import { POLYGON_NODE } from '@/utils/constant';



const policyDecisionNode = (graph: Graph) => {
  return graph.createNode({
    id: getGraphId('pd'),
    shape: POLYGON_NODE,
    attrs: {
      body: {
        refPoints: '0,10 10,0 20,10 10,20',
      },
    },
    label: '决策',
    data: {
      settingConfig: 'policyDecision-config',
      configValues: {
        label: '决策',
      },
      codeEditor: true,
      validateRules: {
        inOut: true,
      },
      templateCode: 'policyDecisionTemplateCode',
    },
    ports: {
      groups: {
        [PortsPosition.topIn]: portsTop,
        [PortsPosition.bottomOut]: portsBottom,
        [PortsPosition.leftIn]: portsLeft,
        [PortsPosition.rightOut]: portsRight,
      },
      items: [
        {
          group: PortsPosition.topIn,
        },
        {
          group: PortsPosition.bottomOut,
        },
        {
          group: PortsPosition.leftIn,
        },
        {
          group: PortsPosition.rightOut,
        },
      ],
    },
  });
};

export default policyDecisionNode;
