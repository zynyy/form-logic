import { Field } from '@formily/core';
import { defineComponent, shallowRef } from 'vue';

import { useForm } from '@/form-provider';
import { useAttach } from '@/hooks';
import { ReactiveField } from '@/reactive-field';
import { observer } from '@/utils';

import { provideField, useField } from './hooks';
import { FieldProps, getFieldProps } from './interface';

const FieldComponent = observer(
  defineComponent({
    name: 'Field',
    props: getFieldProps(),
    inheritAttrs: false,
    setup(props: FieldProps, { slots }) {
      const formRef = useForm();
      const parentRef = useField();

      const { basePath } = props;

      const createField = () => {
        return formRef?.value?.createField?.({
          ...props,
          basePath: basePath ?? parentRef.value?.address,
        });
      };

      const fieldRef = shallowRef<Field>(createField());

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

export default FieldComponent;
