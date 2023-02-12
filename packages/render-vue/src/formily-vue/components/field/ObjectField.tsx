import { defineComponent, shallowRef, watch } from 'vue';
import { Field } from '@formily/core';
import { observer } from '@/utils/observer';
import { useAttach } from '@/formily-vue/hooks';

import { ObjectFieldProps, getObjectFieldProps } from './interface';
import { useField, provideField } from './hooks';
import ReactiveField from '../reactive-field';
import { useForm } from '../form-provider';

const ObjectFieldComponent = observer<ObjectFieldProps>(
  defineComponent({
    name: 'ObjectField',
    props: getObjectFieldProps(),
    setup(props: ObjectFieldProps, { slots }) {
      const formRef = useForm();
      const parentRef = useField();

      const { basePath, name } = props;

      const createField = () => {
        return formRef?.value?.createObjectField?.({
          name,
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

      watch(formRef, () => {
        fieldRef.value = createField();
      });


      useAttach(fieldRef);
      provideField(fieldRef);

      return () => {
        return <ReactiveField field={fieldRef.value} v-slots={slots} />;
      };
    },
  }),
);

export default ObjectFieldComponent;
