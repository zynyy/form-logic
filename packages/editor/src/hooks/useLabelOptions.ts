import { useMemo } from 'react';
import { toArray } from '@/utils';

export const useLabelOptions = (options, value) => {
  return useMemo(() => {
    const data = toArray(options);

    const valArr = toArray(value);

    return (
      valArr
        .map((val) => {
          return data.find((cur) => cur.value === val)?.label;
        })
        .filter((val) => val)
        .join('、') || valArr.join('、')
    );
  }, [value, options]);
};
