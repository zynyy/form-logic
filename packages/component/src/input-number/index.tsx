import React, { FC } from 'react';
import { InputNumber as AntdInputNumber, InputNumberProps as AntdInputNumberProps } from 'antd';

export interface InputNumberProps extends AntdInputNumberProps {}

const InputNumber: FC<InputNumberProps> = ({ readOnly, value, ...restProps }) => {
  return readOnly ? <span>{value}</span> : <AntdInputNumber min={0} value={value} {...restProps} />;
};

export default InputNumber;
