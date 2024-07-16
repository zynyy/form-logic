import type { Ref } from 'vue';

import { reactiveComputed } from '@/utils';

import { useOperation } from './useOperation';

export const useMoveHelper = (workspaceId?: Ref<string | undefined>) => {
  const operation = useOperation(workspaceId);
  return reactiveComputed(() => operation.value?.moveHelper);
};
