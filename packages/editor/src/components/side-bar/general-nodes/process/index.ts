import { Graph } from '@antv/x6';
import { PortsPosition } from '../interface';
import { portsBottom, portsLeft, portsRight, portsTop } from '../ports';
import { getGraphId } from '@/utils';



const processNode = (graph: Graph) => {
  return graph.createNode({
    id: getGraphId('fn'),
    shape: 'custom-rect',
    label: '函数',
    data: {
      settingConfig: 'process-config',
      configValues: {
        label: '函数',
      },
      codeEditor: true,
      validateRules: {
        inOut: true,
      },
      templateCode: 'processTemplateCode',
    },
    ports: {
      groups: {
        [PortsPosition.topIn]: portsTop,
        [PortsPosition.leftIn]: portsLeft,
        [PortsPosition.bottomOut]: portsBottom,
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

export default processNode;
