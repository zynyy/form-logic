import { onUnmounted, Ref, watchEffect } from 'vue';

export interface IRecycleTarget {
  onMount: () => void;
  onUnmount: () => void;
}

export const useAttach = <T extends IRecycleTarget>(target: Ref<T>): Ref<T> => {
  watchEffect((onCleanup: any) => {
    target.value?.onMount();

    onCleanup(() => {
      target.value?.onUnmount();
    });
  });

  onUnmounted(() => {
    target.value?.onUnmount();
  });
  return target;
};
