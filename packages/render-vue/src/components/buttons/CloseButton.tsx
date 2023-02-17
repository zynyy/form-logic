import { CloseOutlined, RollbackOutlined } from "@ant-design/icons-vue";

import CustomButton, { CustomButtonProps } from '../custom-button';
import { defineComponent } from 'vue';

export interface BackButtonProps extends Omit<CustomButtonProps, 'icon'> {}

const CloseButton = defineComponent({
  name: 'CloseButton',
  setup(props: BackButtonProps) {

    return () => {
      return (
        <CustomButton
          title="关闭"
          {...props}
          v-slots={{
            icon: () => <CloseOutlined />,
          }}
        />
      );
    };
  },
});

export default CloseButton;
