import { Graph } from '@antv/x6';
import { PortsPosition } from '../interface';
import { portsBottom, portsLeft, portsRight, portsTop } from '../ports';
import { getGraphId } from '@/utils';



const dataNode = (graph: Graph) => {
  return graph.createNode({
    id: getGraphId('data'),
    shape: 'custom-polygon',
    attrs: {
      body: {
        refPoints: '10,0 40,0 30,20 0,20',
      },
    },
    label: '数据',
    data: {
      settingConfig: 'data-config',
      configValues: {
        label: '数据',
      },
      codeEditor: true,
      validateRules: {
        inOut: true,
      },
      templateCode: 'dataTemplateCode',
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
          group: PortsPosition.leftIn,
        },
        {
          group: PortsPosition.bottomOut,
        },
        {
          group: PortsPosition.rightOut,
        },
      ],
    },
  });
};

export default dataNode;
