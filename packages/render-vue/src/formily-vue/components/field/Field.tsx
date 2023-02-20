import { defineComponent, shallowRef, watch } from 'vue';
import { Field } from '@formily/core';
import { observer } from '@/formily-vue/shared';
import { useAttach } from '@/formily-vue/hooks';
import { FieldProps, getFieldProps } from './interface';
import {ReactiveField} from '../reactive-field';
import { provideField, useField } from './hooks';
import { useForm } from '../form-provider';

const FieldComponent = observer<FieldProps>(
  defineComponent({
    name: 'Field',
    props: getFieldProps(),
    inheritAttrs: false,
    setup(props: FieldProps, { slots }) {
      const formRef = useForm();
      const parentRef = useField();

      const { basePath, name } = props;

      const createField = () => {

        return formRef?.value?.createField?.({
          name,
          ...props,
          basePath: basePath ?? parentRef.value?.address,
        });
      };


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

      const fieldRef = shallowRef<Field>(createField());

      useAttach(fieldRef);
      provideField(fieldRef);

      return () => {
        return <ReactiveField field={fieldRef.value} v-slots={slots} />;
      };
    },
  }),
);

export default FieldComponent;
