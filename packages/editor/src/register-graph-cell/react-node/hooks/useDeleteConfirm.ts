import { Node } from '@antv/x6';

import { DELETE_GRAPH_EVENT } from '@/utils/constant';

 export  const useDeleteConfirm = (node: Node) => {
  const handleDeleteConfirm = () => {
    node.model.graph.trigger(DELETE_GRAPH_EVENT, { node });
  };

  return [handleDeleteConfirm];
};
