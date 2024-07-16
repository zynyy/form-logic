import { FC } from 'react';

import { GROUP_MODE } from '@/utils/constant';
import { StaticSelect, StaticSelectProps } from '@formlogic/component';

export interface GroupModeSelectProps extends Omit<StaticSelectProps, 'data'> {}

const GroupModeSelect: FC<GroupModeSelectProps> = ({ ...restProps }) => {
  return <StaticSelect {...restProps} data={GROUP_MODE} />;
};

export default GroupModeSelect;
