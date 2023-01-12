import { FC } from 'react';

import { FIELD_TYPE_DATA } from '@/utils/constant';
import { StaticSelect, StaticSelectProps } from '@formlogic/component';

export interface FieldTypeSelectProps extends Omit<StaticSelectProps, 'data'> {}

const FieldTypeSelect: FC<FieldTypeSelectProps> = ({ ...restProps }) => {
  return <StaticSelect {...restProps} data={FIELD_TYPE_DATA} />;
};

export default FieldTypeSelect;
