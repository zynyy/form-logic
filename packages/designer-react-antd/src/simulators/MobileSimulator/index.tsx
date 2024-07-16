import './styles.less';

import cls from 'classnames';
import { defineComponent } from 'vue';

import { usePrefix } from '@/hooks';

import { MobileBody } from './body';

export const MobileSimulator = defineComponent({
  name: 'DnMobileSimulator',
  props: {
    className: {},
  },
  setup(props, { attrs, slots }) {
    const prefixRef = usePrefix('mobile-simulator');
    return () => {
      return (
        <div
          //@ts-ignore
          class={cls(prefixRef.value, props.className)}
          {...{
            attrs,
          }}
        >
          <div class={prefixRef.value + '-content'}>
            <MobileBody>{slots.default?.()}</MobileBody>
          </div>
        </div>
      );
    };
  },
});
