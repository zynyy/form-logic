import { FC } from 'react';

import { REQUEST_METHOD } from '@/utils/constant';
import { StaticSelect, StaticSelectProps } from '@formlogic/component';

export interface RequestMethodSelectProps extends Omit<StaticSelectProps, 'data'> {}

const RequestMethodSelect: FC<RequestMethodSelectProps> = ({ ...restProps }) => {
  return <StaticSelect {...restProps} data={REQUEST_METHOD} />;
};

export default RequestMethodSelect;
