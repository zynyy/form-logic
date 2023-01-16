import React, { FC } from 'react';
import { Input as AntdInput, InputProps as AntdInputProps } from 'antd';

export interface InputProps extends AntdInputProps {}

const Input: FC<InputProps> = ({ readOnly, value, ...restProps }) => {
  return readOnly ? <span>{value}</span> : <AntdInput readOnly={readOnly} value={value} allowClear {...restProps} />;
};

export default Input;
