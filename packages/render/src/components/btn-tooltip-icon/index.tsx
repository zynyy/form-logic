import {FC} from "react";
import {Button, ButtonProps, Tooltip, TooltipProps} from "antd";

interface BtnIconProps extends ButtonProps {
  tooltip: TooltipProps["title"];
}

const BtnTooltipIcon: FC<BtnIconProps> = ({ tooltip, ...btnProps }) => {
  return (
    <Tooltip title={tooltip}>
      <Button {...btnProps} type="link" />
    </Tooltip>
  );
};

export default BtnTooltipIcon;
