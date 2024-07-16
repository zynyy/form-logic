import { TreeNode } from '@formlogic/designer-core';
import { Ref } from 'vue';

import { TreeNodeSymbol, useContext } from '@/context';

export const useTreeNode = () => {
  return useContext(TreeNodeSymbol) as Ref<TreeNode>;
};
