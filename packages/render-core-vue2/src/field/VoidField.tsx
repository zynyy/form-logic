import { VoidField } from '@formily/core';
import { defineComponent, shallowRef, watch } from 'vue';

import { useForm } from '@/form-provider';
import { useAttach } from '@/hooks';
import { ReactiveField } from '@/reactive-field';
import { observer } from '@/utils';

import { provideField, useField } from './hooks';
import { VoidFieldProps, getVoidFieldProps } from './interface';

const VoidFieldComponent = observer(
  defineComponent({
    name: 'VoidField',
    props: getVoidFieldProps(),
    inheritAttrs: false,
    setup(props: VoidFieldProps, { slots }) {
      const formRef = useForm();
      const parentRef = useField();

      const createField = () => {
        const { basePath } = props;
        return formRef.value?.createVoidField?.({
          ...props,
          basePath: basePath ?? parentRef.value?.address,
        });
      };

      const fieldRef = shallowRef<VoidField>(createField());

      watch(
        () => props,
        () => {
          fieldRef.value = createField();
        },
      );

      watch(
        () => formRef.value.id,
        () => {
          fieldRef.value = createField();
        },
      );

      useAttach(fieldRef);
      provideField(fieldRef);

      return () => {
        return (
          <ReactiveField field={fieldRef.value}>
            {slots.default?.({ field: fieldRef.value })}
          </ReactiveField>
        );
      };
    },
  }),
);

export default VoidFieldComponent;
