import React, { FC } from 'react';
import { Input, InputProps } from 'antd';

import { UserOutlined } from '@ant-design/icons';

export const UserInput: FC<InputProps> = ({ readOnly, value, ...restProps }) => {
  return readOnly ? (
    <span>{value}</span>
  ) : (
    <Input
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
