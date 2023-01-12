import { FC } from 'react';

import { YSE_OR_DATA } from '@/utils/constant';

import { StaticRadio, StaticRadioProps } from '@formlogic/component';

export interface YesNoRadioProps extends Omit<StaticRadioProps, 'data'> {}

const YesNoRadio: FC<YesNoRadioProps> = ({ ...restProps }) => {
  return <StaticRadio data={YSE_OR_DATA} {...restProps} />;
};

export default YesNoRadio;
