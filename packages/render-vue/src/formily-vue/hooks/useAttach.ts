import { onMounted, watch, Ref, onUnmounted, nextTick } from 'vue';
import { loop } from '@/utils';

interface IRecycleTarget {
  onMount: () => void;
  onUnmount: () => void;
}

export const useAttach = <T extends IRecycleTarget>(target: Ref<T>): Ref<T> => {
  watch(target, (v, old, onInvalidate) => {
    if (v && v !== old) {
      old?.onUnmount();

      nextTick(() => {
        v.onMount();
      }).then(loop);
      onInvalidate(() => v.onUnmount());
    }
  });
  onMounted(() => {
    target.value?.onMount();
  });
  onUnmounted(() => {
    target.value?.onUnmount();
  });
  return target;
};
