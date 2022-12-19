import { FC, memo } from 'react';
import { IconProps } from '@/components/ali-react-table/interfaces';

const CaretRightIcon: FC<IconProps> = (props) => {
  return (
    <svg
      focusable="false"
      preserveAspectRatio="xMidYMid meet"
      fill="currentColor"
      width="16"
      height="16"
      viewBox="0 0 32 32"
      {...props}
    >
      <path d="M12 8L22 16 12 24z" />
    </svg>
  );
};
export default memo(CaretRightIcon);
