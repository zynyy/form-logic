import { FC, memo } from 'react';
import { IconProps, SortOrder } from '@/components/ali-react-table/interfaces';

interface SortIconProps extends IconProps {
  size?: number;
  order?: SortOrder;
}

const SortIcon: FC<SortIconProps> = ({ size, order, ...restProps }) => {
  return (
    <svg
      focusable="false"
      preserveAspectRatio="xMidYMid meet"
      width={size}
      height={size}
      viewBox="0 0 32 32"
      aria-hidden="true"
      {...restProps}
    >
      <path
        fill={order === 'asc' ? '#23A3FF' : '#bfbfbf'}
        transform="translate(0, 4)"
        d="M8 8L16 0 24 8z"
      />
      <path
        fill={order === 'desc' ? '#23A3FF' : '#bfbfbf'}
        transform="translate(0, -4)"
        d="M24 24L16 32 8 24z "
      />
    </svg>
  );
};
export default memo(SortIcon);
