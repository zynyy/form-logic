import { each } from '@formily/shared';
import { VNodeProps } from 'vue';

export interface FormatProps extends VNodeProps {
  [key: string]: any;
}

export const formatComponentProps = (props: FormatProps) => {
  const newData: Record<string, any> = {};
  each(props, (value, key) => {
    if (key === 'on' || key === 'nativeOn') {
      if (value) {
        each(value, (func, name) => {
          const eventName = `on${key === 'on' ? name[0].toUpperCase() : name[0]}${name.slice(1)}`;
          newData[eventName] = func;
        });
      }
    } else if (key === 'attrs' || key === 'props' || key === 'domProps') {
      Object.assign(newData, value);
    } else {
      newData[key] = value;
    }
  });
  return newData;
};
