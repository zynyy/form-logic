import { MutableRefObject, useEffect, useRef, useState } from 'react';

const useDOMHover = <DOM extends HTMLElement>(): [boolean, MutableRefObject<DOM>] => {
  const [hover, setHover] = useState(false);

  const domRef = useRef<DOM>();

  useEffect(() => {
    if (domRef.current) {
      domRef.current.addEventListener('mouseover', () => {
        setHover(true);
      });
      domRef.current.addEventListener('mouseout', () => {
        setHover(false);
      });
    }

    return () => {
      if (domRef.current) {
        domRef.current.removeEventListener('mouseover', () => {});
        domRef.current.removeEventListener('mouseout', () => {});
      }
    };
  }, [domRef.current]);

  return [hover, domRef];
};

export default useDOMHover;
