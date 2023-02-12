import { onBeforeUnmount } from 'vue';
import { uid } from '@formily/shared';
import { useStylePrefixCls } from '@/components/style/hooks';

export * from './context';

export type KeyMapProps = WeakMap<Record<string, unknown>, string> | string[] | null;

export const useItemKey = (isObject = true) => {
  let keyMap: KeyMapProps = null;

  if (isObject) {
    keyMap = new WeakMap();
  } else {
    keyMap = [];
  }

  onBeforeUnmount(() => {
    keyMap = null;
  });

  return {
    getRecordKey: (record: any) => {
      if (keyMap instanceof WeakMap) {
        if (!keyMap.has(record)) {
          keyMap.set(record, uid());
        }

        return `${keyMap.get(record)}`;
      }
    },
    getIndexKey: (index: number) => {
      if (!keyMap[index]) {
        keyMap[index] = uid();
      }

      return `${keyMap[index]}-${index}`;
    },
  };
};

export const useArrayBasePrefix = (componentName: string) => {
  const prefix = useStylePrefixCls('array-base');

  return `${prefix}-${componentName}`;
};
