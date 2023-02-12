import { CustomButtonMode } from '@/interface';

import { Space } from 'ant-design-vue';
import { defineComponent, h } from 'vue';
import CustomButton from '@/components/custom-button';
import { ButtonsProps, getButtonsProps } from './interface';
import { formatComponentProps } from '@/utils';

const Buttons = defineComponent({
  name: 'Buttons',
  props: getButtonsProps(),
  inheritAttrs: false,
  setup(props: ButtonsProps) {
    return () => {
      const { buttons, components, loading, disabled, onClick } = props;

      return (
        <Space>
          {buttons?.map((item) => {
            const { name, logics, eventCode, code, component, componentProps } = item || {};

            const clickCodes =
              logics
                ?.filter((item) => item.effectHook === 'onClick')
                .map((item) => item.logicCode) || [];

            const Component = components?.[component] || CustomButton;

            return h(Component, {
              type: 'default',
              ...formatComponentProps(componentProps),
              loading,
              disabled,
              key: code,
              title: name,
              onClick: async (e) => {
                await onClick?.(e, {
                  code,
                  eventCode,
                  clickCodes,
                  name,
                });
              },
              mode: CustomButtonMode.text,
            });
          })}
        </Space>
      );
    };
  },
});

export default Buttons;
