import { FC } from 'react';

import { YSE_OR_DATA } from '@/utils/constant';
import { StaticSelect, StaticSelectProps } from '@formlogic/component';

export interface YesNoSelectProps extends Omit<StaticSelectProps, 'data'> {}

const YesNoSelect: FC<YesNoSelectProps> = ({ ...restProps }) => {
  return <StaticSelect {...restProps} data={YSE_OR_DATA} />;
};

export default YesNoSelect;
