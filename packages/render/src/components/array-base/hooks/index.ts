import { useArrayItemContext } from './context';

import style from '../style';

import { useComponentStyle } from '@formlogic/component';
import { toJS } from '@formily/reactive';
import { uid } from '@formily/shared';
import { useEffect, useRef, useState } from 'react';

export { useArrayContext } from './context';

export type { ArrayBaseValueContext, ArrayItemValueContext, ArrayContext } from './context';

export type KeyMapProps = WeakMap<Record<string, unknown>, string> | string[] | null;

export const useArrayIndex = () => {
  const ctx = useArrayItemContext();
  return ctx.index ?? 0;
};

export const useArrayItemRecord = () => {
  const ctx = useArrayItemContext();
  return ctx.record ? toJS(ctx.record) : {};
};

export const useArrayBaseStyle = () => {
  return useComponentStyle('array-base', style);
};

export const useItemKey = (isObject = true) => {
  const keyMapRef = useRef<KeyMapProps>(isObject ? new WeakMap() : []);

  useEffect(() => {
    return () => {
      keyMapRef.current = null;
    };
  }, []);

  return {
    getRecordKey: (record: any) => {
      if (keyMapRef.current instanceof WeakMap) {
        if (!keyMapRef.current.has(record)) {
          keyMapRef.current.set(record, uid());
        }

        return `${keyMapRef.current.get(record)}`;
      }
    },
    getIndexKey: (index: number) => {
      if (!keyMapRef.current[index]) {
        keyMapRef.current[index] = uid();
      }

      return `${keyMapRef.current[index]}-${index}`;
    },
  };
};
