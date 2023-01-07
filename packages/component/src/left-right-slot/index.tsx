import { Col, Row, RowProps, Space } from 'antd';
import { FC, ReactNode } from 'react';
import { useLeftRightSlotStyle } from '@/left-right-slot/hooks';
import cls from 'classnames';

export interface LeftRightSlotProps extends RowProps {
  left?: ReactNode;
  right?: ReactNode;
}

const LeftRightSlot: FC<LeftRightSlotProps> = ({ left, right, className, ...rowProps }) => {
  const [warpSSR, hashId, prefixCls] = useLeftRightSlotStyle();

  return warpSSR(
    <Row gutter={12} {...rowProps} className={cls(hashId, className, prefixCls)}>
      <Col span={12} className={cls(hashId, `${prefixCls}-left`)}>
        <Space>{left}</Space>
      </Col>
      <Col span={12} className={cls(hashId, `${prefixCls}-right`)}>
        <Space>{right}</Space>
      </Col>
    </Row>,
  );
};

export default LeftRightSlot;
