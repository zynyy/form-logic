import { observe, toJS } from '@formily/reactive';
import { onBeforeUnmount, ref } from 'vue';

import { useTreeNode } from './useTreeNode';

export const useNodeProps = () => {
  const nodeRef = useTreeNode();

  const nodePropsRef = ref(toJS(nodeRef.value?.props));

  const dispose = observe(nodeRef.value.props as any, () => {
    nodePropsRef.value = toJS(nodeRef.value?.props);
  });

  onBeforeUnmount(() => {
    dispose();
  });

  return nodePropsRef;
};
