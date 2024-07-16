import { ref } from 'vue';

import { useWorkbench } from '@/hooks';

export const useCurrentWorkspaceId = () => {
  const workbenchRef = useWorkbench();

  const currentWorkspace =
    workbenchRef.value?.activeWorkspace || workbenchRef.value?.currentWorkspace;
  return ref(currentWorkspace?.id);
};
