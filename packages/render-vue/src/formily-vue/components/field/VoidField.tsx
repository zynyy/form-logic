import { defineComponent, shallowRef, watch } from 'vue';
import { VoidField } from '@formily/core';

import { useAttach } from '@/formily-vue/hooks';

import { observer } from '@/formily-vue/shared';
import { getVoidFieldProps, VoidFieldProps } from './interface';

import {ReactiveField} from '../reactive-field';
import { useForm } from '../form-provider';
import { provideField, useField } from './hooks';

const VoidFieldComponent = observer<VoidFieldProps>(
  defineComponent({
    name: 'VoidField',
    props: getVoidFieldProps(),
    inheritAttrs: false,
    setup(props: VoidFieldProps, { slots }) {
      const formRef = useForm();
      const parentRef = useField();

      const { basePath, name } = props;

      const createField = () => {
        return formRef?.value?.createVoidField?.({
          name,
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
        return <ReactiveField field={fieldRef.value} v-slots={slots} />;
      };
    },
  }),
);

export default VoidFieldComponent;
