import { Engine, GlobalRegistry } from '@formlogic/designer-core';
import { PropType, defineComponent, onBeforeUnmount, provide, ref, toRef, watchEffect } from 'vue';

import { DesignerEngineSymbol } from '@/context';
import { useDesigner } from '@/hooks';
import { GhostWidget } from '@/widgets';

import * as icons from '../icons';
import { Layout } from './Layout';
import { DnWorkbench } from './Workbench';

GlobalRegistry.registerDesignerIcons(icons);

export const Designer = defineComponent({
  name: 'DnDesigner',
  props: {
    engine: {
      type: Object as PropType<Engine>,
    },
    theme: { type: String, default: 'light' },
    prefixCls: { type: String, default: 'dn-' },
  },
  setup(props, { slots }) {
    const engine = useDesigner();
    const refInstance = ref<Engine>();
    const designerRef = ref();

    provide(DesignerEngineSymbol, toRef(props, 'engine'));

    watchEffect(() => {
      if (props.engine) {
        if (props.engine && refInstance.value) {
          if (props.engine !== refInstance.value) {
            refInstance.value.unmount();
          }
        }
        props.engine.mount(designerRef.value);
        refInstance.value = props.engine;
      }
    });

    onBeforeUnmount(() => {
      if (props.engine) {
        props.engine.unmount(designerRef.value);
      }
    });

    if (engine.value) {
      throw new Error('There can only be one Designable Engine Context in the React Tree');
    }

    return () => {
      return (
        <div
          ref={designerRef}
          style={{
            height: '100%',
          }}
        >
          <Layout theme={props.theme} prefixCls={props.prefixCls}>
            <DnWorkbench>{slots.default?.()}</DnWorkbench>
            <GhostWidget />
          </Layout>
        </div>
      );
    };
  },
});
