import { TreeNode } from '@formlogic/designer-core';
import { InjectionKey, Ref } from 'vue';

interface INodeContext {
  renderTitle?: (node: TreeNode) => any;
  renderActions?: (node: TreeNode) => any;
}

export const NodeSymbol: InjectionKey<Ref<INodeContext & any>> = Symbol('INodeContext');
