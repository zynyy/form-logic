import { computed, Ref } from 'vue';

import { useOperation } from './useOperation';

export const useSelection = (workspaceId?: Ref<string | undefined>) => {
  const operation = useOperation(workspaceId);

  return computed(() => {
    return operation.value?.selection;
  });
};
