import { MutableRefObject, useEffect, useRef, useState } from 'react';

export const useDomHover = (): [boolean, MutableRefObject<HTMLElement>] => {
  const [hover, setHover] = useState(false);

  const hoverDomRef = useRef<HTMLElement>();

  useEffect(() => {
    if (hoverDomRef.current) {
      hoverDomRef.current.addEventListener('mouseover', () => {
        setHover(true);
      });
      hoverDomRef.current.addEventListener('mouseout', () => {
        setHover(false);
      });
    }

    return () => {
      if (hoverDomRef.current) {
        hoverDomRef.current.removeEventListener('mouseover', () => {});
        hoverDomRef.current.removeEventListener('mouseout', () => {});
      }
    };
  }, [hoverDomRef.current]);

  return [hover, hoverDomRef];
};
