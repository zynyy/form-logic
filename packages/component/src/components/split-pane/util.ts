import { Children, ReactNode } from 'react';
import { Size } from './interface';

export const unFocus = (document: Document) => {
  document.getSelection()?.removeAllRanges();
};

export const getDefaultSize = (
  defaultSize: Size | undefined,
  minSize: Size | undefined,
  maxSize: Size | undefined,
  draggedSize: Size | undefined,
) => {
  if (typeof draggedSize === 'number') {
    const min = typeof minSize === 'number' ? minSize : 0;
    const max = typeof maxSize === 'number' && maxSize >= 0 ? maxSize : Infinity;
    return Math.max(min, Math.min(max, draggedSize));
  }
  if (defaultSize !== undefined) {
    return defaultSize;
  }
  return minSize;
};

export const removeNullChildren = (children: ReactNode) => {
  return Children.toArray(children).filter((c) => c);
};
