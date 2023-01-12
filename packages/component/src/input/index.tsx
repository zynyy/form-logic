import React, { FC } from 'react';
import { Input as AntdInput, InputProps as AntdInputProps } from 'antd';

export interface InputProps extends AntdInputProps {}

const Input: FC<InputProps> = ({ readOnly, value, ...restProps }) => {
  return readOnly ? <span>{value}</span> : <AntdInput value={value} {...restProps} />;
};

export default Input;