import { FC, memo } from 'react';
import { IconProps } from '@/components/ali-react-table/interfaces';

const CaretDownIcon: FC<IconProps> = (props) => {
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
      <path d="M24 12L16 22 8 12z" />
    </svg>
  );
};
export default  memo(CaretDownIcon) ;
