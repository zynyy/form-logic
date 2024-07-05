import { GeneralField, isVoidField } from '@formily/core';
import { FormPath, each, isFn, isStr } from '@formily/shared';
import { SetupContext, defineComponent, h, markRaw } from 'vue';

import { useField } from '@/field/hooks';
import type { IComponentMapper, IStateMapper, VueComponent, VueComponentProps } from '@/interface';
import { formatComponentProps } from '@/utils';

import { observer } from './observer';

export function mapProps<T extends VueComponent = VueComponent>(
  ...args: IStateMapper<VueComponentProps<T>>[]
) {
  const transform = (input: any, field: GeneralField) =>
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
        name: target.name ? `${target.name}Editable` : `ConnectedEditableComponent`,
        setup(props, { attrs, slots }: any) {
          const fieldRef = useField();

          return () => {
            const newAttrs = fieldRef.value
              ? transform({ ...attrs } as VueComponentProps<T>, fieldRef.value)
              : { ...attrs };

            return h(
              target,
              formatComponentProps({
                attrs: newAttrs,
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
        name: target.name ? `${target.name}Read` : `ReadComponent`,
        setup(props, { attrs, slots }: Record<string, any>) {
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
        name: target.name ? `${target.name}ReadOnly` : `ReadOnlyComponent`,
        setup(props, { attrs, slots }: Record<string, any>) {
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
              }),

              slots,
            );
          };
        },
      }),
    );
  };
}

export const connect = <T extends VueComponent>(target: T, ...args: IComponentMapper[]): T => {
  const Component = args.reduce((target: VueComponent, mapper) => {
    return mapper(target);
  }, target);

  const functionalComponent = (props: any, context: SetupContext) => {
    return h(Component, context.attrs, context.slots);
  };

  return markRaw(functionalComponent) as T;
};
