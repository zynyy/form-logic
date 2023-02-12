import { defineComponent, toRef, watch } from 'vue';

import { provideForm } from './hooks';

import { observer } from '@/utils/observer';
import { useCleaner } from '@/formily-vue/hooks/useCleaner';

import { FormProviderProps, getFormProviderProps } from './interface';
import { useAttach } from '@/formily-vue/hooks';

export default observer<FormProviderProps>(
  defineComponent({
    name: 'FormProvider',
    inheritAttrs: false,
    props: getFormProviderProps(),
    setup(props: FormProviderProps, { slots }) {
    //  useCleaner();
      const formRef = useAttach(toRef(props, 'form'));

      provideForm(formRef);

      return () => {

        return slots.default?.();
      };
    },
  }),
);
