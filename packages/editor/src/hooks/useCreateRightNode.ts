import { Node } from '@antv/x6';
import { useEffect, useRef } from 'react';

export const useCreateRightNode = (node: Node) => {
  const btnRef = useRef(null);

  useEffect(() => {
    const rightNodes = node.model.graph.getNeighbors(node, {
      outgoing: true,
    });

    if (!rightNodes.length) {
      btnRef.current?.click();
    }
  }, []);
  return btnRef;
};
