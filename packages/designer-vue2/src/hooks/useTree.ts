import { computed, Ref } from 'vue';

import { useOperation } from './useOperation';

export const useTree = (workspaceId?: Ref<string | undefined>) => {
  const operation = useOperation(workspaceId);
  return computed(() => operation.value?.tree);
};
