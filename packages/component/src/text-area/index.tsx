import React, { FC } from 'react';
import { Input } from 'antd';

const { TextArea: AntdTextArea } = Input;

import { TextAreaProps as AntdTextAreaProps } from 'antd/es/input';

export interface TextAreaProps extends AntdTextAreaProps {

}

const TextArea: FC<TextAreaProps> = ({ readOnly, value, ...restProps }) => {
  return readOnly ? <span>{value}</span> : <AntdTextArea value={value} allowClear {...restProps} />;
};

export default TextArea;
