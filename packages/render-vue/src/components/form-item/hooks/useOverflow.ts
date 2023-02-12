import useDOMResizeChange from '@/hooks/dom/useDOMResizeChange';
import { ref, watchEffect } from 'vue';

const useOverflow = <Container extends HTMLElement, Content extends HTMLElement>() => {
  const overflow = ref(false);

  const [containerChange, containerRef] = useDOMResizeChange<Container>();
  const [contentChange, contentRef] = useDOMResizeChange<Content>();

  watchEffect(() => {
    if (
      contentRef.value &&
      containerRef.value &&
      contentChange.value >= 0 &&
      containerChange.value >= 0
    ) {
      const contentWidth = contentRef.value.getBoundingClientRect().width;
      const containerWidth = containerRef.value.getBoundingClientRect().width;

      if (contentWidth && containerWidth && containerWidth < contentWidth) {
        if (!overflow.value) {
          overflow.value = true;
        }
      } else {
        if (overflow.value) {
          overflow.value = false;
        }
      }
    }
  });

  return {
    overflow,
    containerRef,
    contentRef,
  };
};

export default useOverflow;
