import { FC, useEffect, useRef } from 'react';

import { Graph, Node } from '@antv/x6';
import { Skeleton } from 'antd';

import { Stencil } from '@antv/x6-plugin-stencil';
import generalNodes from './general-nodes';
import { useMode } from '@/hooks';

export interface SideBarProps {
  graph: Graph | undefined;
}

const SideBar: FC<SideBarProps> = ({ graph }) => {
  const sideBarRef = useRef<HTMLDivElement>(null);

  const { isEditable } = useMode();

  useEffect(() => {
    if (graph && isEditable) {
      const newStencil = new Stencil({
        target: graph,
        stencilGraphWidth: 200,
        stencilGraphHeight: 0,
        groups: [
          {
            name: 'generalNode',
            title: '通用节点',
          },
          {
            name: 'functionNode',
            title: '功能节点',
            collapsable: false,
          },
        ],
        getDragNode: (node: Node) => node.clone({ keepId: true }),
        getDropNode: (node: Node) => {
          genNodes();
          return node.clone({ keepId: true });
        },
      });

      if (sideBarRef.current) {
        sideBarRef.current.appendChild(newStencil.container);
      }

      const genNodes = () => {
        const nodes = generalNodes(graph);
        newStencil.load(nodes, 'generalNode');
      };

      genNodes();
    }
  }, [graph, isEditable]);

  return isEditable ? (
    <div id="side-bar-stencil">
      {graph ? <div className="side-bar-stencil" ref={sideBarRef} /> : <Skeleton />}
    </div>
  ) : null;
};

export default SideBar;
