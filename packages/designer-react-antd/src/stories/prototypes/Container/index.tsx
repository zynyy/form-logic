import './styles.less';

import { observer, VueComponent } from '@formlogic/render-vue2';
import { uid } from '@formlogic/designer-core';
import { defineComponent, unref } from 'vue';

import { useNodeIdProps, useNodeProps } from '@/hooks';
import { DroppableWidget } from '@/widgets';

import { FormItem } from 'element-ui';

export const Container = defineComponent({
  name: 'DnContainer',
  setup(props, { slots }) {
    return () => {
      return <DroppableWidget scopedSlots={slots} />;
    };
  },
});

export const ContainerEmpty = defineComponent({
  name: 'DnContainerEmpty',
  props: ['description', 'height'],
  setup(props, { slots }) {
    return () => {
      return (
        <DroppableWidget key={uid()}>
          <div style={{ height: props.height ?? '50px' }} class="dn-droppable-placeholder">
            {props.description ?? '请将左边组件拖拽进来'}
          </div>
        </DroppableWidget>
      );
    };
  },
});

export const withContainer = (Target: VueComponent) => {
  return defineComponent({
    setup(props, { attrs, slots }) {
      return () => {
        const { default: childrenSlots, ...rest } = slots;

        return (
          <DroppableWidget>
            <Target attrs={attrs} scopedSlots={rest}>
              {childrenSlots?.()}
            </Target>
          </DroppableWidget>
        );
      };
    },
  });
};

export const withComponentWarp = (Target: VueComponent) => {
  return observer(
    defineComponent({
      inheritAttrs: false,
      setup(props, { slots }) {
        const nodeIdAttr = useNodeIdProps();

        const nodePropsRef = useNodeProps();

        return () => {
          const { componentProps, colSpan, name, hiddenName, required, disabled, defaultValue } =
            unref(nodePropsRef) || {};

          const arrayColumn = false;

          return (
            <FormItem
              hiddenLabel={arrayColumn || hiddenName}
              label={name}
              gridSpan={arrayColumn ? 12 : colSpan || 1}
              asterisk={required}
              attrs={nodeIdAttr.value}
            >
              <Target
                attrs={{
                  ...componentProps,
                  disabled,
                  value: defaultValue ?? '',
                }}
              >
                {slots.default?.()}
              </Target>
            </FormItem>
          );
        };
      },
    }),
  );
};
