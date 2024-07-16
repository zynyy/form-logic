import { isStr } from '@formlogic/designer-core';
import { CSSProperties } from '@vue/runtime-dom';
import { getCurrentInstance } from 'vue';

import { css2Obj } from '@/utils';

/**
 * 获取组件外层绑定的style对象
 * @returns
 */
export const useStyle = (): CSSProperties => {
  const currentInstance = getCurrentInstance();

  let style = currentInstance?.proxy.$vnode.data?.style;

  if (isStr(style)) {
    style = css2Obj(style as string);
  }
  if (Array.isArray(style)) {
    style = Object.assign({}, ...style);
  }
  return style as CSSProperties;
};
