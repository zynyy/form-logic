import { RollbackOutlined } from '@ant-design/icons-vue';

import CustomButton, { CustomButtonProps } from '../custom-button';
import { defineComponent } from 'vue';

export interface BackButtonProps extends Omit<CustomButtonProps, 'icon'> {}

const BackButton = defineComponent({
  name: 'BackButton',
  setup(props: BackButtonProps) {
    const handleBackClick = (e) => {
      const { onClick } = props;
      if (onClick) {
        onClick(e);
        return;
      }
      history.back();
    };

    return () => {
      return (
        <CustomButton
          title="返回"
          {...props}
          onClick={handleBackClick}
          v-slots={{
            icon: () => <RollbackOutlined />,
          }}
        />
      );
    };
  },
});

export default BackButton;
