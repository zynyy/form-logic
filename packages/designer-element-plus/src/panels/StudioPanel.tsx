import cls from 'classnames';
import { defineComponent, unref } from 'vue';

import { Layout } from '@/containers';
import { usePrefix } from '@/hooks';

const StudioPanelInternal = defineComponent({
  name: 'DnStudioPanel',
  setup(props, { attrs, slots }) {
    const prefixRef = usePrefix('main-panel');

    if (slots.logo || slots.actions) {
      return () => {
        const prefix = unref(prefixRef);

        return (
          <div {...{ attrs }} class={cls(prefix + '-container', {})}>
            <div class={prefix + '-header'}>
              <div class={prefix + '-header-logo'}>{slots.logo?.()}</div>
              <div class={prefix + '-header-actions'}>{slots.actions?.()}</div>
            </div>
            <div class={prefix}>{slots.default?.()}</div>
          </div>
        );
      };
    }

    return () => {
      return (
        <div
          class={cls(prefixRef.value, {})}
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

export const StudioPanel = defineComponent({
  props: {
    theme: { type: String, default: 'light' },
    prefixCls: { type: String, default: 'dn-' },
  },
  setup(props, { slots }) {
    const scopedSlots = {
      logo: slots.logo,
      actions: slots.actions,
    };

    return () => {
      return (
        // @ts-ignore
        <Layout
          {...{
            attrs: { theme: props.theme, prefixCls: props.prefixCls },
          }}
        >
          <StudioPanelInternal {...{ attrs: props, scopedSlots }}>
            {slots.default?.()}
          </StudioPanelInternal>
        </Layout>
      );
    };
  },
});
