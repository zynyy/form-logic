import type { Workspace } from '@formlogic/designer-core';
import type { Ref } from 'vue';
import { computed, ref } from 'vue';

import { useWorkspaceId } from '@/context';

import { useDesigner } from './useDesigner';

export const useWorkspace = (id?: Ref<string | undefined>): Ref<Workspace> => {
  const designer = useDesigner();
  const workspaceRef = ref();

  const workspaceIdRef = useWorkspaceId();

  const workspaceId = computed(() => id?.value || workspaceIdRef.value);
  if (workspaceId.value) {
    workspaceRef.value = designer.value.workbench.findWorkspaceById(workspaceId.value);
  }
  //@ts-ignore
  if (window['__DESIGNER_WORKSPACE__']) {
    //@ts-ignore
    workspaceRef.value = window['__DESIGNER_WORKSPACE__'];
  }
  workspaceRef.value = designer.value.workbench.currentWorkspace;
  return workspaceRef;
};
