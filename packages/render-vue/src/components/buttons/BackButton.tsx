import { RollbackOutlined } from '@ant-design/icons-vue';

import CustomButton, { CustomButtonProps } from '../custom-button';
import { defineComponent } from 'vue';
import omit from 'lodash.omit';

export interface BackButtonProps extends Omit<CustomButtonProps, 'icon'> {}

const BackButton = defineComponent({
  name: 'BackButton',
  inheritAttrs: false,
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
          {...omit(props, 'onClick')}
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
