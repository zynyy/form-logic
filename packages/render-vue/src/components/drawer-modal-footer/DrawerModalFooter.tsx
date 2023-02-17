import { defineComponent, VNode } from 'vue';
import LeftRightSlot from '@/components/left-right-slot';
import CustomButton from '@/components/custom-button';
import Buttons, { CloseButton } from '@/components/buttons';
import { CheckOutlined } from '@ant-design/icons-vue';
import { DrawerModalFooterProps, getDrawerModalFooterProps } from './interface';

const DrawerModalFooter = defineComponent({
  name: 'DrawerModalFooter',
  props: getDrawerModalFooterProps(),
  setup: (props: DrawerModalFooterProps) => {
    return () => {
      const {
        hasCloseButton,
        onCloseCLick,
        buttons,
        onClick,
        disabled,
        loading,
        components,
        hasConfirmButton,
        hasButtons,
        onConfirmClick,
      } = props;

      const slots: Record<string, () => VNode> = {};

      if (hasCloseButton) {
        slots.left = () => {
          return <CloseButton onClick={onCloseCLick} />;
        };
      }

      if (hasConfirmButton || hasButtons) {
        slots.right = () => {
          return (
            <>
              {hasButtons ? (
                <Buttons
                  loading={loading}
                  disabled={disabled}
                  buttons={buttons}
                  onClick={onClick}
                  components={components}
                />
              ) : null}

              {hasConfirmButton ? (
                <CustomButton
                  title="确定"
                  onClick={onConfirmClick}
                  loading={loading}
                  disabled={disabled}
                  type="primary"
                  v-slots={{
                    icon: () => <CheckOutlined />,
                  }}
                />
              ) : null}
            </>
          );
        };
      }

      return <LeftRightSlot v-slots={slots} />;
    };
  },
});

export default DrawerModalFooter;
