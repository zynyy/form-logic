import { FC, forwardRef, MouseEvent, RefAttributes, useState } from 'react';
import { Button, ButtonProps, Popconfirm, Tooltip } from 'antd';
import { CustomButtonMode, CustomButtonModeType } from '@/interface';

export interface CustomButtonProps<Ref = HTMLElement> extends ButtonProps, RefAttributes<Ref> {
  hasTooltip?: boolean;
  hasPopConfirm?: boolean;
  mode?: CustomButtonModeType;
  onClick?: (e: MouseEvent<HTMLElement>) => void;
}

const CustomButton: FC<CustomButtonProps> = forwardRef(
  ({ title, hasTooltip, hasPopConfirm, onClick, mode, children, ...btnProps }, ref) => {
    const [popConfirmOpen, setPopConfirmOpen] = useState(false);
    const [tooltipOpen, setToolTipOpen] = useState(false);

    const handleConfirmOpenChange = (open) => {
      setToolTipOpen(false);
      setPopConfirmOpen(open);
    };

    const handleTooltipOpenChange = (open) => {
      if (popConfirmOpen) {
        return;
      }

      setToolTipOpen(open);
    };

    const renderButton = () => {
      if (mode === CustomButtonMode.icon) {
        return (
          <Button
            type="text"
            {...btnProps}
            onClick={hasPopConfirm ? undefined : onClick}
            ref={ref}
          />
        );
      }

      return (
        <Button type="dashed" {...btnProps} onClick={hasPopConfirm ? undefined : onClick} ref={ref}>
          {children ?? title}
        </Button>
      );
    };

    if (hasTooltip && hasPopConfirm) {
      return (
        <Popconfirm
          onOpenChange={handleConfirmOpenChange}
          title={`是否确定${title}`}
          onConfirm={onClick}
        >
          <span>
            <Tooltip title={title} open={tooltipOpen} onOpenChange={handleTooltipOpenChange}>
              {renderButton()}
            </Tooltip>
          </span>
        </Popconfirm>
      );
    }

    if (hasTooltip) {
      return <Tooltip title={title}>{renderButton()}</Tooltip>;
    }

    if (hasPopConfirm) {
      return (
        <Popconfirm title={`是否确定${title}`} onConfirm={onClick}>
          {renderButton()}
        </Popconfirm>
      );
    }

    return renderButton();
  },
);

export default CustomButton;
