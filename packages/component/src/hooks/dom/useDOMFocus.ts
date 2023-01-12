import { MutableRefObject, useEffect, useRef, useState } from 'react';

const useDOMFocus = <DOM extends HTMLElement>(): [boolean, MutableRefObject<DOM>] => {
  const [isFocus, setIsFocus] = useState(false);

  const domRef = useRef<DOM>();

  useEffect(() => {
    if (domRef.current) {
      domRef.current.addEventListener(
        'focus',
        () => {
          setIsFocus(true);
        },
        {
          capture: true,
        },
      );
      domRef.current.addEventListener(
        'blur',
        () => {
          setIsFocus(false);
        },
        {
          capture: true,
        },
      );
    }
    return () => {
      if (domRef.current) {
        domRef.current.removeEventListener('focus', () => {});
        domRef.current.removeEventListener('focusout', () => {});
      }
    };
  }, []);

  return [isFocus, domRef];
};

export default useDOMFocus;
