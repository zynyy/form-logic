import { computed, Ref } from 'vue';

import { useWorkspace } from './useWorkspace';

export const useViewport = (workspaceId?: Ref<string | undefined>) => {
  const workspace = useWorkspace(workspaceId);
  return computed(() => workspace.value?.viewport);
};
