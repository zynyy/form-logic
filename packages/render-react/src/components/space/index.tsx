import { Space as AntdSpace, SpaceProps } from 'antd';
import { FC } from 'react';

export type { SpaceProps } from 'antd';
const Space: FC<SpaceProps> = (props) => {
  return <AntdSpace {...props} />;
};

export default Space;
