import { MutableRefObject, useEffect, useState } from 'react';

import useDOMResizeChange from './useDOMResizeChange';

const useDOMRect = <DOM extends HTMLElement>(): [DOMRectReadOnly, MutableRefObject<DOM>] => {
  const [contentRect, setContentRect] = useState<DOMRectReadOnly>();

  const [change, domRef] = useDOMResizeChange<DOM>();

  useEffect(() => {
    setContentRect(domRef.current?.getBoundingClientRect());
  }, [change]);

  return [contentRect, domRef];
};

export default useDOMRect;
