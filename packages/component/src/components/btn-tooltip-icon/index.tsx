import {FC} from "react";
import {Button, ButtonProps, Tooltip, TooltipProps} from "antd";

interface BtnIconProps extends ButtonProps {
  tooltip: TooltipProps["title"];
}

const BtnTooltipIcon: FC<BtnIconProps> = ({ tooltip, ...btnProps }) => {
  return (
    <Tooltip title={tooltip}>
      <Button type="text" {...btnProps}  />
    </Tooltip>
  );
};

export default BtnTooltipIcon;
