import useDOMResizeChange from './useDOMResizeChange';
import { ref, Ref, watchEffect } from 'vue';

const useDOMRect = <DOM extends HTMLElement>(): [Ref<DOMRectReadOnly>, Ref<DOM>] => {
  const contentRect = ref<DOMRectReadOnly>();

  const [change, domRef] = useDOMResizeChange<DOM>();

  watchEffect(() => {
    if (change.value >= 0) {
      contentRect.value = domRef.value?.getBoundingClientRect();
    }
  });

  return [contentRect, domRef];
};

export default useDOMRect;
