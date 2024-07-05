import { observe, toJS } from '@formily/reactive';
import { isEqual } from '@formily/shared';
import { onUnmounted, ref } from 'vue';

import { useField } from '@/field';

export const useFiledProps = () => {
  const field = useField();

  const decoratorProps = ref<Record<any, any>>(toJS(field.value.decoratorProps));
  const componentProps = ref<Record<any, any>>(toJS(field.value.componentProps));

  const disposeComponentProps = observe(field.value.componentProps, (change) => {
    const { value, key, path } = change;

    if (path.length === 1) {
      componentProps.value = toJS(change.value);
    } else {
      if (!isEqual(change.value, componentProps.value[key as unknown as string])) {
        componentProps.value[key as unknown as string] = toJS(value);
      }
    }
  });

  const disposeDecoratorProps = observe(field.value.decoratorProps, (change) => {
    const { value, key, path } = change;
    if (path.length === 1) {
      decoratorProps.value = toJS(value);
    } else {
      if (!isEqual(value, decoratorProps.value[change.key as unknown as string])) {
        decoratorProps.value[key as unknown as string] = toJS(value);
      }
    }
  });

  onUnmounted(() => {
    disposeComponentProps();
    disposeDecoratorProps();
  });

  return {
    decoratorProps,
    componentProps,
  };
};
