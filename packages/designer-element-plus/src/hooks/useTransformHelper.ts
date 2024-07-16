import { Ref } from 'vue';

import { useOperation } from './useOperation';

export const useTransformHelper = (workspaceId?: Ref<string | undefined>) => {
  const operation = useOperation(workspaceId);
  return operation.value?.transformHelper;
};
