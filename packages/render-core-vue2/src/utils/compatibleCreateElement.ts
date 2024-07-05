import { h } from 'vue';

import Fragment from '@/fragment';

type RenderChildren = {
  [key in string]?: (...args: any[]) => (VNode | string)[];
};

type Tag = any;
type VNodeData = Record<string, any>;
type VNode = any;
type VNodeChildren = any;

export const compatibleCreateElement = (
  tag: Tag,
  data: VNodeData,
  components: RenderChildren,
): any => {
  const scopedSlots = components || {}; // 默认全部作为 scopedSlots 处理

  const children: VNodeChildren[] = [];

  /**
   * scopedSlots 不会映射为slots，所以这里手动映射一遍
   * 主要为了解决 slots.x 问题
   */
  Object.keys(components || {}).forEach((key) => {
    const func = components[key];
    // 转换为 slots 传递
    if (typeof func === 'function' && func.length === 0) {
      /**
       * func 参数为0的判断不准确，因为composition-api包了一层，导致全部为0
       * try catch 解决scoped slots 转换参数异常问题
       * */
      try {
        const child = func();

        children.push(key === 'default' ? child : h(Fragment, { slot: key }, [child]));
      } catch (error) {
        console.error(error);
      }
    }
  });
  const newData = Object.assign({}, data);

  if (Object.keys(scopedSlots || {}).length > 0) {
    if (!newData.scopedSlots) {
      newData.scopedSlots = scopedSlots;
    } else {
      newData.scopedSlots = {
        ...newData.scopedSlots,
        ...scopedSlots,
      };
    }
  }

  return h(tag, newData, children);
};
