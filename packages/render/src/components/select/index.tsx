import React, { FC } from 'react';
import { Select as AntdInput, SelectProps } from 'antd';

export const Select: FC<SelectProps & { readOnly: boolean }> = ({
  readOnly,
  value,
  ...restProps
}) => {
  return readOnly ? <span>{value}</span> : <AntdInput value={value} {...restProps} />;
};

export default Select;
