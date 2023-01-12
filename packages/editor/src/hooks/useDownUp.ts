import { useEffect, useState } from 'react';

import { Node } from '@antv/x6';
import { useMode } from '@/hooks/useMode';
import { LOGIC_PROCESS_SHOW_DOWN_UP_GRAPH_EVENT } from '@/utils/constant';

export const useDownUp = (node: Node) => {
  const [downShow, setDownShow] = useState(false);
  const [upShow, setUpShow] = useState(false);

  const { isFieldMode, isEditable } = useMode();

  const getNeighborsNodes = () => {
    const incomingNode = node.model.graph.getNeighbors(node, {
      incoming: true,
    })[0];

    if (incomingNode) {
      const outgoingNodes = node.model.graph.getNeighbors(incomingNode, {
        outgoing: true,
      });
      return {
        incomingNode,
        outgoingNodes,
      };
    }

    return {
      incomingNode,
      outgoingNodes: [],
    };
  };

  const checkShow = () => {
    const { incomingNode, outgoingNodes } = getNeighborsNodes();

    if (!incomingNode) {
      return;
    }

    const lastIndex = outgoingNodes.length - 1;

    const index = outgoingNodes.findIndex((item) => item.id === node.id);

    if (index === 0 || lastIndex === 0) {
      setUpShow(false);
    } else {
      setUpShow(isFieldMode && isEditable);
    }

    if ((lastIndex === index && index !== 0) || lastIndex === 0) {
      setDownShow(false);
    } else {
      setDownShow(isFieldMode && isEditable);
    }
  };

  useEffect(() => {
    checkShow();
    node.model.graph.on(LOGIC_PROCESS_SHOW_DOWN_UP_GRAPH_EVENT, () => {
      checkShow();
    });
  }, []);

  const down = () => {
    const { incomingNode, outgoingNodes } = getNeighborsNodes();

    if (!incomingNode) {
      return;
    }

    const index = outgoingNodes.findIndex((item) => item.id === node.id);

    const nextIndex = index + 1;

    const nextNode = outgoingNodes[nextIndex];

    const nextData = nextNode.data;

    const curData = node.data;
    node.setData(nextData, {
      overwrite: true,
    });
    nextNode.setData(curData, {
      overwrite: true,
    });
  };

  const up = () => {
    const { incomingNode, outgoingNodes } = getNeighborsNodes();

    if (!incomingNode) {
      return;
    }

    const index = outgoingNodes.findIndex((item) => item.id === node.id);

    const prevIndex = index - 1;

    const prevNode = outgoingNodes[prevIndex];

    const prevData = prevNode.data;

    const curData = node.data;

    prevNode.setData(curData, {
      overwrite: true,
    });

    node.setData(prevData, {
      overwrite: true,
    });
  };

  return {
    down,
    downShow,
    up,
    upShow,
    checkShow,
  };
};
