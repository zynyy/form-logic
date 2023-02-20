import { markRaw, defineComponent, h } from 'vue';
import { isFn, isStr, FormPath, each } from '@formily/shared';
import { isVoidField, GeneralField } from '@formily/core';
import { observer } from './observer';

import { useField } from '@/formily-vue/components/field';

import type { VueComponent, IComponentMapper, IStateMapper, VueComponentProps } from '../interface';
import { formatComponentProps } from '@/utils';

export function mapProps<T extends VueComponent = VueComponent>(
  ...args: IStateMapper<VueComponentProps<T>>[]
) {
  const transform = (input: VueComponentProps<T>, field: GeneralField) =>
    args.reduce((props, mapper) => {
      if (isFn(mapper)) {
        props = Object.assign(props, mapper(props, field));
      } else {
        each(mapper, (to, extract) => {
          const extractValue = FormPath.getIn(field, extract);
          const targetValue = isStr(to) ? to : extract;
          if (extract === 'value') {
            if (to !== extract) {
              delete props['value'];
            }
          }
          FormPath.setIn(props, targetValue, extractValue);
        });
      }
      return props;
    }, input);

  return (target: T) => {
    return observer(
      defineComponent({
        name: target.name ? `Connected${target.name}` : `ConnectedComponent`,
        setup(props, { attrs, slots, listeners }: any) {
          const fieldRef = useField();

          return () => {
            const newAttrs = fieldRef.value
              ? transform({ ...attrs } as VueComponentProps<T>, fieldRef.value)
              : { ...attrs };

            return h(
              target,
              formatComponentProps({
                attrs: newAttrs,
                on: listeners,
              }),
              slots,
            );
          };
        },
      }),
    );
  };
}

export function mapReadPretty<T extends VueComponent, C extends VueComponent>(
  component: C,
  readPrettyProps?: Record<string, any>,
) {
  return (target: T) => {
    return observer(
      defineComponent({
        name: target.name ? `Read${target.name}` : `ReadComponent`,
        setup(props, { attrs, slots, listeners }: Record<string, any>) {
          const fieldRef = useField();
          return () => {
            const field = fieldRef.value;
            return h(
              field && !isVoidField(field) && field.pattern === 'readPretty' ? component : target,
              formatComponentProps({
                attrs: {
                  ...readPrettyProps,
                  ...attrs,
                },
                on: listeners,
              }),
              slots,
            );
          };
        },
      }),
    );
  };
}

export function mapReadOnly<T extends VueComponent, C extends VueComponent>(
  component: C,
  readPrettyProps?: Record<string, any>,
) {
  return (target: T) => {
    return observer(
      defineComponent({
        name: target.name ? `ReadOnly${target.name}` : `ReadOnlyComponent`,
        setup(props, { attrs, slots, listeners }: Record<string, any>) {
          const fieldRef = useField();
          return () => {
            const field = fieldRef.value;
            return h(
              field && !isVoidField(field) && field.pattern === 'readOnly' ? component : target,
              formatComponentProps({
                attrs: {
                  ...readPrettyProps,
                  ...attrs,
                },
                on: listeners,
              }),
              slots,
            );
          };
        },
      }),
    );
  };
}

export function connect<T extends VueComponent>(target: T, ...args: IComponentMapper[]): T {
  const Component = args.reduce((target: VueComponent, mapper) => {
    return mapper(target);
  }, target);

  const functionalComponent = defineComponent({
    name: target.name,
    setup(props, { attrs, slots }) {
      return () => {
        return h(Component, formatComponentProps({ props, attrs }), slots);
      };
    },
  });
  return markRaw(functionalComponent) as unknown as T;
}
