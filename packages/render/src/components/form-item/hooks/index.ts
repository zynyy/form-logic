import { usePrefixCls } from '@/components/hooks';
import style from '../style';
import { UseStyleReturnType } from '@/interface';
import { MutableRefObject, useEffect, useRef, useState } from 'react';

export const useFormItemStyle = (): UseStyleReturnType => {
  const prefixCls = usePrefixCls('formily-form-item');
  const [warpSSR, hashId] = style(prefixCls);

  return [warpSSR, hashId, prefixCls];
};

export const useDomHover = (): [boolean, MutableRefObject<HTMLElement>] => {
  const [isHover, setIsHover] = useState(false);

  const domRef = useRef<HTMLElement>();

  useEffect(() => {
    if (domRef.current) {
      domRef.current.addEventListener('mouseenter', () => {
        setIsHover(true);
      });
      domRef.current.addEventListener('mouseleave', () => {
        setIsHover(false);
      });
    }
    return () => {
      if (domRef.current) {
        domRef.current.removeEventListener('mouseenter', () => {});
        domRef.current.removeEventListener('mouseleave', () => {});
      }
    };
  }, []);

  return [isHover, domRef];
};

export const useDomFocus = (): [boolean, MutableRefObject<HTMLDivElement>] => {
  const [isFocus, setIsFocus] = useState(false);

  const domRef = useRef<HTMLDivElement>();

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
