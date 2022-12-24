import React, { FC } from 'react';
import { Input as AntdInput, InputProps } from '@formlogic/render';

import { UserOutlined } from '@ant-design/icons';

export const UserInput: FC<InputProps> = ({ readOnly, value, ...restProps }) => {
  return readOnly ? (
    <span>{value}</span>
  ) : (
    <AntdInput
      value={value}
      {...restProps}
      placeholder="请输入用户名"
      prefix={
        <UserOutlined
          style={{
            color: '#1890ff',
          }}
          className="prefixIcon"
        />
      }
    />
  );
};

export default UserInput;
