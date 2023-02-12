import ResizeObserver from 'resize-observer-polyfill';
import { Ref, ref, watchEffect } from 'vue';

const useDOMResizeChange = <DOM extends HTMLElement>(): [Ref<number>, Ref<DOM>] => {
  const change = ref(0);

  const domRef = ref<DOM>();

  watchEffect((onCleanup) => {
    const ele = domRef.value;

    if (!ele) {
      return;
    }

    const resizeObserver = new ResizeObserver((resizeObserverEntry) => {
      resizeObserverEntry.forEach(() => {
        change.value = change.value + 1;
      });
    });

    resizeObserver.observe(ele);

    onCleanup(() => {
      resizeObserver.unobserve(ele);
    });
  });

  return [change, domRef];
};

export default useDOMResizeChange;
