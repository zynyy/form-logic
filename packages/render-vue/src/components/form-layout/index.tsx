import { defineComponent } from 'vue';
import { formLayoutProvide, useResponsiveFormLayout } from '@/components/form-layout/hooks';
import { FormLayoutProps, formLayoutProps } from '@/components/form-layout/interface';

const FormLayout = defineComponent({
  name: 'FormLayout',
  inheritAttrs: false,
  props: formLayoutProps,
  setup(props: FormLayoutProps, {slots}) {
    const { domRef } = useResponsiveFormLayout(props);

    formLayoutProvide(props);

    return () => {

      return (
        <div
          ref={domRef}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}
        >
          {slots.default?.()}
        </div>
      );
    };
  },
});

export default FormLayout;
