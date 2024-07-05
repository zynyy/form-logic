import { ArrayField } from '@formily/core';
import { defineComponent, shallowRef, watch } from 'vue';

import { useForm } from '@/form-provider';
import { useAttach } from '@/hooks';
import { observer } from '@/utils';

import { ReactiveField } from '../reactive-field';
import { provideField, useField } from './hooks';
import { ArrayFieldProps, getArrayFieldProps } from './interface';

const ArrayFieldComponent = observer(
  defineComponent({
    name: 'ArrayField',
    inheritAttrs: false,
    props: getArrayFieldProps(),
    setup(props: ArrayFieldProps, { slots }) {
      const formRef = useForm();
      const parentRef = useField();

      const createField = () => {
        const { basePath } = props;
        return formRef?.value?.createArrayField?.({
          ...props,
          basePath: basePath ?? parentRef.value?.address,
        });
      };

      const fieldRef = shallowRef<ArrayField>(createField());

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
        return <ReactiveField>{slots.default?.({ field: fieldRef.value })}</ReactiveField>;
      };
    },
  }),
);

export default ArrayFieldComponent;
