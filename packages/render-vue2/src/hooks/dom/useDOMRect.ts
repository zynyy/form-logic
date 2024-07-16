import { ref, Ref, watchEffect } from 'vue';
import useDOMResizeChange from './useDOMResizeChange';

const useDOMRect = <DOM extends HTMLElement>(): [
  Ref<DOMRectReadOnly>,
  Ref<DOM | undefined>,
] => {
  const contentRect = ref<DOMRectReadOnly>(new DOMRectReadOnly());

  const [change, domRef] = useDOMResizeChange<DOM>();

  watchEffect(() => {
    if (change.value >= 0) {
      contentRect.value =
        domRef.value?.getBoundingClientRect() ?? new DOMRectReadOnly();
    }
  });

  return [contentRect, domRef];
};

export default useDOMRect;
