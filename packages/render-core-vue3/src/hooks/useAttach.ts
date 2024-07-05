import { onMounted, onUnmounted, Ref } from 'vue';

export interface IRecycleTarget {
  onMount: () => void;
  onUnmount: () => void;
}

export const useAttach = <T extends IRecycleTarget>(target: Ref<T>): Ref<T> => {
  onMounted(() => {
    target.value?.onMount();
  });

  onUnmounted(() => {
    target.value?.onUnmount();
  });
  return target;
};
