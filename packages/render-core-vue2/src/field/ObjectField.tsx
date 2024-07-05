import { Field } from '@formily/core';
import { defineComponent, shallowRef, watch } from 'vue';

import { useForm } from '@/form-provider';
import { useAttach } from '@/hooks';
import { observer } from '@/utils';

import { ReactiveField } from '../reactive-field';
import { provideField, useField } from './hooks';
import { ObjectFieldProps, getObjectFieldProps } from './interface';

const ObjectFieldComponent = observer(
  defineComponent({
    name: 'ObjectField',
    props: getObjectFieldProps(),
    setup(props: ObjectFieldProps, { slots }) {
      const formRef = useForm();
      const parentRef = useField();

      const { basePath } = props;

      const createField = () => {
        return formRef?.value?.createObjectField?.({
          ...props,
          basePath: basePath ?? parentRef.value?.address,
        });
      };

      const fieldRef = shallowRef<Field>(createField());

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

export default ObjectFieldComponent;
