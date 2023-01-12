import { useLayoutEffect, useState } from 'react';

import ResizeObserver from 'resize-observer-polyfill';

const useVisualHeight = (): string => {
  const [height, setHeight] = useState('100%');

  useLayoutEffect(() => {
    let animationFrameID = 0;

    const ele = document.body;

    const resizeSub = new ResizeObserver(() => {
      animationFrameID = window.requestAnimationFrame(() => {
        setHeight(`${ele.clientHeight - 140}px`);
      });
    });

    if (ele) {
      resizeSub.observe(ele);
    }

    return () => {
      resizeSub.unobserve(ele);
      window.cancelAnimationFrame(animationFrameID);
    };
  }, []);

  return height;
};

export default useVisualHeight;
