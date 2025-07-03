import { FC, ReactNode } from 'react';
import { Input as AntdInput, InputProps as AntdInputProps } from 'antd';

export interface InputProps extends AntdInputProps {}

const Input: FC<InputProps> = ({ readOnly, addonBefore, addonAfter, value, ...restProps }) => {
  return readOnly && !(addonBefore || addonAfter) ? (
    <span>{value as ReactNode}</span>
  ) : (
    <AntdInput
      addonBefore={addonBefore}
      addonAfter={addonAfter}
      readOnly={readOnly}
      value={value}
      allowClear
      {...restProps}
    />
  );
};

export default Input;
