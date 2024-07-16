import { FC } from 'react';

import { SCHEMA_TYPE_DATA } from '@/utils/constant';
import { StaticSelect, StaticSelectProps } from '@formlogic/component';

export interface SchemaTypeSelectProps extends Omit<StaticSelectProps, 'data'> {}

const SchemaTypeSelect: FC<SchemaTypeSelectProps> = ({ ...restProps }) => {
  return <StaticSelect {...restProps} data={SCHEMA_TYPE_DATA} />;
};

export default SchemaTypeSelect;
