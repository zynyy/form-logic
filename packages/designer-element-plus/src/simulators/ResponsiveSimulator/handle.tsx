import cls from 'classnames';
import { defineComponent } from 'vue';

import { usePrefix } from '@/hooks';
export enum ResizeHandleType {
  Resize = 'RESIZE',
  ResizeWidth = 'RESIZE_WIDTH',
  ResizeHeight = 'RESIZE_HEIGHT',
}

export interface IResizeHandleProps {
  type?: ResizeHandleType;
}

export const ResizeHandle = defineComponent({
  props: ['type'],
  setup(props, { slots, attrs }) {
    const prefixRef = usePrefix('resize-handle');
    return () => {
      return (
        <div
          data-designer-resize-handle={props.type}
          class={cls(prefixRef.value, {
            [`${prefixRef.value}-${props.type}`]: !!props.type,
          })}
          {...{
            attrs,
          }}
        >
          {slots.default?.()}
        </div>
      );
    };
  },
});
