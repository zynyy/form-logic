import { computed, Ref } from 'vue';

import { useOperation } from './useOperation';

export const useHover = (workspaceId?: Ref<string | undefined>) => {
  const operation = useOperation();
  return computed(() => operation.value?.hover);
};
