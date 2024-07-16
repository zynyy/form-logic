import './styles.less';

import cls from 'classnames';
import { defineComponent } from 'vue';

import { usePrefix } from '@/hooks';

export const PCSimulator = defineComponent({
  name: 'DnPCSimulator',
  props: {
    className: {
      type: String,
    },
  },
  setup(props, { attrs, slots }) {
    const prefix = usePrefix('pc-simulator');

    return () => {
      return (
        <div
          //@ts-ignore
          class={cls(prefix.value, props.className)}
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
