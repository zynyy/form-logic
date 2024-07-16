import { Fragment } from '@formlogic/render-vue2';
import cls from 'classnames';
import { defineComponent, provide, ref } from 'vue';

import { DesignerLayoutSymbol, IDesignerLayoutContext, useContext } from '@/context';
import { IDesignerLayoutProps } from '@/types';

export const Layout = defineComponent({
  name: 'DnLayout',
  props: {
    theme: { type: String, default: 'light' },
    prefixCls: { type: String, default: 'dn-' },
  },
  setup(props, { slots }) {
    const layoutRef = useContext<IDesignerLayoutContext>(DesignerLayoutSymbol);

    if (layoutRef.value) {
      return () => {
        return <Fragment>{slots.default?.()}</Fragment>;
      };
    }

    provide(
      DesignerLayoutSymbol,
      ref({
        theme: props.theme,
        prefixCls: props.prefixCls,
      } as IDesignerLayoutProps),
    );

    return () => {
      return (
        <div
          class={cls({
            [`${props.prefixCls}app`]: true,
            [`${props.prefixCls}${props.theme}`]: props.theme,
          })}
        >
          {slots.default?.()}
        </div>
      );
    };
  },
});
