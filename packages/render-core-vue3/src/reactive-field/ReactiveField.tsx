import { isVoidField, onFieldValueChange } from '@formily/core';
import { toJS } from '@formily/reactive';
import { FormPath, isEqual } from '@formily/shared';
import { debounce, merge, omit } from 'lodash-es';
import {
  defineComponent,
  h,
  nextTick,
  onMounted,
  ref,
  resolveComponent,
  shallowRef,
  VNode,
} from 'vue';

import { useField } from '@/field';
import { useForm, useFormEffects } from '@/form-provider';
import Fragment from '@/fragment';
import { useInputCursor } from '@/hooks';
import { useSchemaComponentsContext } from '@/schema-field';
import { formatComponentProps, loop, observer } from '@/utils';

import { useFiledProps } from './hooks';
import { getReactiveFieldProps, ReactiveFieldProps } from './interface';

const wrapFragment = (childNodes: VNode[] | VNode): VNode => {
  if (!Array.isArray(childNodes)) {
    return childNodes;
  }
  if (childNodes.length > 1) {
    return h(Fragment, {}, { default: () => childNodes });
  }
  return childNodes[0];
};

const OMIT_EVENT = [
  '@change',
  'onChange',
  'change',
  '@input',
  'onInput',
  'input',
  '@focus',
  'onFocus',
  'focus',
  '@blur',
  'onBlur',
  'blur',
  '@update:modelValue',
  'onUpdate:modelValue',
];

export default observer(
  defineComponent({
    name: 'ReactiveField',
    inheritAttrs: false,
    props: getReactiveFieldProps(),
    setup(props: ReactiveFieldProps, { slots }) {
      const componentsRef = useSchemaComponentsContext();

      const form = useForm();
      const fieldRef = useField();
      const [recordCursor, setCursor, setInputDom] = useInputCursor();

      const componentValue = ref(
        !isVoidField(fieldRef.value) ? toJS(fieldRef.value.value) : undefined,
      );

      const inputRef = shallowRef();

      const { decoratorProps, componentProps } = useFiledProps();

      const setComponentValue = (value: any) => {
        const field = fieldRef.value;
        if (field && !isVoidField(field) && !isEqual(componentValue.value, value)) {
          nextTick(() => {
            componentValue.value = toJS(value);

            setTimeout(() => {
              setCursor();
            }, 16);
          }).then(loop);
        }
      };

      useFormEffects(() => {
        if (!isVoidField(fieldRef.value)) {
          onFieldValueChange(fieldRef.value.address, (field) => {
            setComponentValue(field.value);
          });
        }
      });

      onMounted(() => {
        if (inputRef.value?.ref && inputRef.value.ref?.classList?.contains('el-input__inner')) {
          setInputDom(inputRef.value.ref);
        } else if (inputRef.value?.ref?.classList?.contains('el-textarea__inner')) {
          setInputDom(inputRef.value?.ref);
        }
      });

      const triggerChange = debounce((...args: any[]) => {
        const field = fieldRef.value;
        if (field && !isVoidField(field)) {
          field.onInput(...args).then(() => {});
        }
      }, 100);

      const handleInput = (...args: any[]) => {
        triggerChange(...args);
        recordCursor();
        setComponentValue(args[0]);
        const originProps = componentProps.value;
        const originInput = originProps['@update:modelValue'] || originProps['onUpdate:modelValue'];
        originInput?.(...args);
      };

      const handleChange = (...args: any[]) => {
        triggerChange(...args);
        const originProps = componentProps.value;
        const originChange =
          originProps['@change'] || originProps['onChange'] || originProps['change'];
        originChange?.(...args);
      };

      const handleFocus = (...args: any[]) => {
        const field = fieldRef.value;

        if (!field) {
          return;
        }
        if (!isVoidField(field)) {
          field.onFocus(...args).then(loop);
        }
        const originProps = componentProps.value;
        const originFocus = originProps['@focus'] || originProps['onFocus'] || originProps['focus'];
        originFocus?.(...args);
      };

      const handleBlur = (...args: any[]) => {
        const field = fieldRef.value;

        if (!field) {
          return;
        }
        if (!isVoidField(field)) {
          field.onBlur(...args).then(loop);
        }
        const originProps = componentProps.value;
        const originBlur = originProps['@blur'] || originProps['onBlur'] || originProps['blur'];
        originBlur?.(...args);
      };

      const renderDecorator = (childNodes: any[]) => {
        const components = componentsRef.value;
        const field = fieldRef.value;
        if (!field) {
          return;
        }
        if (!field.decoratorType) {
          return wrapFragment(childNodes);
        }

        const Component =
          FormPath.getIn(components, field.decoratorType as string) ??
          resolveComponent(field.decoratorType);

        return h(Component, decoratorProps.value, () => {
          return childNodes;
        });
      };

      const renderComponent = () => {
        const components = componentsRef.value;

        const field = fieldRef.value;

        if (!field) {
          return;
        }

        if (!field.componentType) {
          return wrapFragment(slots.default?.({ field }) ?? []);
        }

        const Component =
          FormPath.getIn(components, field.componentType as string) ??
          resolveComponent(field.componentType);

        const originProps = componentProps.value;

        const events = {} as Record<string, any>;

        const omitKey: string[] = [];

        Object.keys(originProps)
          .filter((key) => key.startsWith('on') && key !== 'on')
          .forEach((eventKey) => {
            const originKey = eventKey;

            const eventName = `${eventKey[2].toLowerCase()}${eventKey.slice(3)}`;
            events[eventName] = originProps[eventKey];

            omitKey.push(originKey);
          });

        Object.keys(originProps)
          .filter((key) => key.startsWith('@'))
          .forEach((eventKey) => {
            events[eventKey.slice(1)] = originProps[eventKey];
            omitKey.push(eventKey);
          });

        events.change = handleChange;

        events['update:modelValue'] = handleInput;

        events.focus = handleFocus;

        events.blur = handleBlur;

        const { style, class: className, attrs, ...restOriginProps } = originProps;

        const fieldDisabled = !isVoidField(field)
          ? field.pattern === 'disabled' || field.pattern === 'readPretty' || field.disabled
          : undefined;

        const componentAttrs = omit(merge(restOriginProps, attrs), ...OMIT_EVENT, ...omitKey);

        const value = !isVoidField(field) ? componentValue.value : undefined;
        const readOnly = !isVoidField(field) ? field.pattern === 'readOnly' : undefined;

        return (
          <Component
            {...formatComponentProps({
              attrs: componentAttrs,
              on: events,
            })}
            readOnly={readOnly}
            class={className}
            style={style}
            value={value}
            modelValue={value}
            disabled={fieldDisabled}
            v-slots={field.content}
            ref={inputRef}
          >
            {slots.default?.({ field })}
          </Component>
        );
      };

      return () => {
        const field = fieldRef.value;

        if (!field) {
          return slots.default?.();
        }

        if (field && form.value.id !== field?.form.id) {
          return null;
        }

        if (field.hidden || field.display !== 'visible') {
          return null;
        }

        return renderDecorator([renderComponent()]);
      };
    },
  }),
);
