import { CloseButton, CustomButton, LeftRightSlot } from '@formlogic/component';

import Buttons, { ButtonsProps } from '@/components/buttons';

import { CheckOutlined } from '@ant-design/icons';
import { FC, MouseEvent } from 'react';

export interface DrawerModalFooterProps extends ButtonsProps {
  hasFooter?: boolean;
  hasCloseButton?: boolean;
  hasConfirmButton?: boolean;
  hasButtons?: boolean;
  onConfirmClick: (e: MouseEvent<HTMLButtonElement>) => void;
  onCloseCLick: (e: MouseEvent<HTMLButtonElement>) => void;
}

const DrawerModalFooter: FC<DrawerModalFooterProps> = ({
  buttons,
  onClick,
  loading,
  disabled,
  onConfirmClick,
  onCloseCLick,
  hasCloseButton,
  hasConfirmButton,
  hasFooter,
  hasButtons,
  components,
}) => {
  if (!hasFooter) {
    return null;
  }

  const left = hasCloseButton ? <CloseButton loading={loading} onClick={onCloseCLick} /> : null;

  return (
    <LeftRightSlot
      left={left}
      right={
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
              loading={loading}
              disabled={disabled}
              onClick={onConfirmClick}
              type="primary"
              icon={<CheckOutlined />}
              key="confirmBtn"
            >
              确定
            </CustomButton>
          ) : null}
        </>
      }
    />
  );
};

DrawerModalFooter.defaultProps = {
  hasFooter: true,
  hasButtons: true,
  hasCloseButton: true,
  hasConfirmButton: true,
};

export default DrawerModalFooter;
