import { defineComponent, shallowRef, watch } from 'vue';

import { ArrayFieldProps, getArrayFieldProps } from './interface';
import { observer } from '@/utils/observer';
import { useAttach } from '@/formily-vue/hooks';
import { ArrayField } from '@formily/core';
import ReactiveField from '../reactive-field';
import { provideField, useField } from './hooks';
import { useForm } from '../form-provider';

const ArrayFieldComponent = observer<ArrayFieldProps>(
  defineComponent({
    name: 'ArrayField',
    inheritAttrs: false,
    props: getArrayFieldProps(),
    setup(props: ArrayFieldProps, { slots }) {
      const formRef = useForm();
      const parentRef = useField();

      const createField = () => {
        const { basePath, name } = props;
        return formRef?.value?.createArrayField?.({
          name,
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
        return <ReactiveField field={fieldRef.value} v-slots={slots} />;
      };
    },
  }),
);

export default ArrayFieldComponent;
