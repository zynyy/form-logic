import { Form } from '@formily/core';
import { defineComponent, Ref, toRef } from 'vue';

import { useAttach } from '@/hooks';
import { observer } from '@/utils';

import { provideForm } from './hooks';
import { FormProviderProps, getFormProviderProps } from './interface';

export default observer(
  defineComponent({
    name: 'FormProvider',
    inheritAttrs: false,
    props: getFormProviderProps(),
    setup(props: FormProviderProps, { slots }) {
      const form = toRef(props, 'form');

      const formRef = useAttach(form as Ref<Form>);

      provideForm(formRef);

      return () => {
        return slots.default?.();
      };
    },
  }),
);
