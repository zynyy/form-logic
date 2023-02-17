import { defineComponent, h } from 'vue';
import { GeneralField, isVoidField } from '@formily/core';
import { FormPath } from '@formily/shared';
import { observer } from '@/utils/observer';
import { toJS } from '@formily/reactive';
import Fragment from '../fragment';

import type { VNode } from 'vue';
import { formatComponentProps, loop } from '@/utils';
import { getReactiveFieldProps, ReactiveFieldProps } from './interface';
import { VueComponentProps } from '@/formily-vue/interface';
import { useSchemaComponentsContext } from '../schema-field';

function isVueOptions(options: Record<string, unknown>) {
  return (
    typeof options.template === 'string' ||
    typeof options.render === 'function' ||
    typeof options.setup === 'function'
  );
}

const wrapFragment = (childNodes: VNode[] | VNode): VNode => {
  if (!Array.isArray(childNodes)) {
    return childNodes;
  }
  if (childNodes.length > 1) {
    return h(Fragment, {}, { default: () => childNodes });
  }
  return childNodes[0];
};

const resolveComponent = (render: () => unknown[], extra?: any) => {
  if (extra === undefined || extra === null) {
    return render;
  }
  if (typeof extra === 'string') {
    return () => [...render(), extra];
  }
  // not component
  if (!isVueOptions(extra) && typeof extra !== 'function') {
    return render;
  }
  // for scoped slot
  if (extra.length > 1 || extra?.render?.length > 1) {
    return (scopedProps: VueComponentProps<any>) => [
      ...render(),
      h(extra, { props: scopedProps }, {}),
    ];
  }
  return () => [...render(), h(extra, {}, {})];
};

const mergeSlots = (
  field: GeneralField,
  slots: Record<string, any>,
  content: any,
): Record<string, (...args: any) => any[]> => {
  const slotNames = Object.keys(slots);
  if (!slotNames.length) {
    if (!content) {
      return {};
    }
    if (typeof content === 'string') {
      return {
        default: resolveComponent(() => [], content),
      };
    }
  }
  const patchSlot =
    (slotName: string) =>
    (originSlotScope: Record<string, any> = {}) =>
      slots[slotName]?.({ field, form: field.form, ...originSlotScope }) ?? [];

  const patchedSlots: Record<string, (...args: any) => unknown[]> = {};
  slotNames.forEach((name) => {
    patchedSlots[name] = patchSlot(name);
  });

  // for named slots
  if (content && typeof content === 'object' && !isVueOptions(content)) {
    Object.keys(content).forEach((key) => {
      const child = content[key];
      const slot = patchedSlots[key] ?? (() => []);
      patchedSlots[key] = resolveComponent(slot, child);
    });
    return patchedSlots;
  }
  // maybe default slot is empty
  patchedSlots['default'] = resolveComponent(patchedSlots['default'] ?? (() => []), content);

  return patchedSlots;
};

export default observer<ReactiveFieldProps>(
  defineComponent({
    name: 'ReactiveField',
    inheritAttrs: false,
    props: getReactiveFieldProps(),
    setup(props: ReactiveFieldProps, { slots }) {
      const componentsRef = useSchemaComponentsContext();

      return () => {
        const components = componentsRef.value;

        const { field } = props;

        if (!field) {
          return slots.default?.();
        }

        if (field.display !== 'visible') {
          return null;
        }

        const mergedSlots = mergeSlots(field, slots, field.content);

        const renderDecorator = (childNodes: any[]) => {
          if (!field.decoratorType) {
            return wrapFragment(childNodes);
          }

          const finalComponent =
            FormPath.getIn(components, field.decoratorType as string) ?? field.decoratorType;

          const componentProps = toJS(field.decorator[1]) || {};

          return h(finalComponent, componentProps, {
            default: () => childNodes,
          });
        };

        const renderComponent = () => {
          if (!field.componentType) return wrapFragment(mergedSlots?.default?.());

          const component =
            FormPath.getIn(components, field.componentType as string) ?? field.componentType;

          const originProps = toJS(field.component[1]) || {};
          const events = {} as Record<string, any>;
          const originChange = originProps['@change'] || originProps['onChange'];
          const originFocus = originProps['@focus'] || originProps['onFocus'];
          const originBlur = originProps['@blur'] || originProps['onBlur'];

          // '@xxx' has higher priority
          Object.keys(originProps)
            .filter((key) => key.startsWith('on'))
            .forEach((eventKey) => {
              const eventName = `${eventKey[2].toLowerCase()}${eventKey.slice(3)}`;
              events[eventName] = originProps[eventKey];
            });

          Object.keys(originProps)
            .filter((key) => key.startsWith('@'))
            .forEach((eventKey) => {
              events[eventKey.slice(1)] = originProps[eventKey];
              delete originProps[eventKey];
            });

          events.change = (...args: any[]) => {
            if (!isVoidField(field)) {
              field.onInput(...args).then(loop);
            }

            originChange?.(...args);
          };

          events.focus = (...args: any[]) => {
            if (!isVoidField(field)) {
              field.onFocus(...args).then(loop);
            }
            originFocus?.(...args);
          };

          events.blur = (...args: any[]) => {
            if (!isVoidField(field)) {
              field.onBlur(...args).then(loop);
            }
            originBlur?.(...args);
          };

          const { style, class: className, ...restOriginProps } = originProps;

          const componentProps = {
            attrs: {
              disabled: !isVoidField(field)
                ? field.pattern === 'disabled' || field.pattern === 'readPretty'
                : undefined,
              readOnly: !isVoidField(field) ? field.pattern === 'readOnly' : undefined,
              ...restOriginProps,
              value: !isVoidField(field) ? field.value : undefined,
            },
            style,
            class: className,
            on: events,
          };

          return h(component, formatComponentProps(componentProps), mergedSlots);
        };

        return renderDecorator([renderComponent()]);
      };
    },
  }),
);
