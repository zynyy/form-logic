import React, { FC, memo } from 'react';
import { IconProps } from '@/components/ali-react-table/interfaces';

const InfoIcon: FC<IconProps> = (props) => {
  return (
    <svg
      focusable="false"
      preserveAspectRatio="xMidYMid meet"
      fill="currentColor"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      {...props}
    >
      <path d="M8.5 11L8.5 6.5 6.5 6.5 6.5 7.5 7.5 7.5 7.5 11 6 11 6 12 10 12 10 11zM8 3.5c-.4 0-.8.3-.8.8S7.6 5 8 5c.4 0 .8-.3.8-.8S8.4 3.5 8 3.5z" />
      <path d="M8,15c-3.9,0-7-3.1-7-7s3.1-7,7-7s7,3.1,7,7S11.9,15,8,15z M8,2C4.7,2,2,4.7,2,8s2.7,6,6,6s6-2.7,6-6S11.3,2,8,2z" />
    </svg>
  );
};
export default memo(InfoIcon);
