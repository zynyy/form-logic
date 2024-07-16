import { useState, useEffect } from 'react';
import { useFormLayoutContext } from '@/components/form-layout/hooks';
import { useDOMResizeChange } from '@formlogic/component';

const useOverflow = <Container extends HTMLElement, Content extends HTMLElement>() => {
  const [overflow, setOverflow] = useState(false);

  const [containerChange, containerRef] = useDOMResizeChange<Container>();
  const [contentChange, contentRef] = useDOMResizeChange<Content>();

  const layout = useFormLayoutContext();
  const labelCol = JSON.stringify(layout.labelCol);

  useEffect(() => {
    if (contentRef.current && containerRef.current) {
      const contentWidth = contentRef.current.getBoundingClientRect().width;
      const containerWidth = containerRef.current.getBoundingClientRect().width;

      if (contentWidth && containerWidth && containerWidth < contentWidth) {
        if (!overflow) {
          setOverflow(true);
        }
      } else {
        if (overflow) {
          setOverflow(false);
        }
      }
    }
  }, [labelCol, containerChange, contentChange]);

  return {
    overflow,
    containerRef,
    contentRef,
  };
};

export default useOverflow;
