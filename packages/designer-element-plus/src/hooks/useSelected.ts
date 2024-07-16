import { observe, toJS } from '@formily/reactive';
import { Ref, onBeforeUnmount, ref } from 'vue';

import { useSelection } from './useSelection';

export const useSelected = (workspaceId?: Ref<string | undefined>) => {
  const selection = useSelection(workspaceId);

  const result = ref(toJS(selection.value?.selected) || []);

  const dispose = observe(selection.value, () => {
    result.value = toJS(selection.value.selected);
  });

  onBeforeUnmount(() => {
    dispose();
  });
  return result;
};
