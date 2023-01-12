import { MutableRefObject, useEffect, useRef, useState } from 'react';
import ResizeObserver from 'resize-observer-polyfill';

const useDOMResizeChange = <DOM extends HTMLElement>(): [number, MutableRefObject<DOM>] => {
  const [change, setChange] = useState(0);

  const domRef = useRef<DOM>();

  useEffect(() => {
    const ele = domRef.current;

    if (!ele) {
      return;
    }

    const resizeObserver = new ResizeObserver((resizeObserverEntry) => {
      resizeObserverEntry.forEach(() => {
        setChange((prev) => prev + 1);
      });
    });

    resizeObserver.observe(ele);

    return () => {
      resizeObserver.unobserve(ele);
    };
  }, [domRef.current]);

  return [change, domRef];
};

export default useDOMResizeChange;
