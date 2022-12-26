import { Col, Row, Space } from 'antd';
import { FC, ReactNode } from 'react';

interface LeftRightSlotProps {
  left?: ReactNode;
  right?: ReactNode;
}

const LeftRightSlot: FC<LeftRightSlotProps> = ({ left, right }) => {
  return (
    <Row className="left-right-slot-warp">
      <Col
        span={12}
        className="left-slot"
        style={{
          textAlign: 'left',
        }}
      >
        <Space>{left}</Space>
      </Col>
      <Col
        span={12}
        className="right-slot"
        style={{
          textAlign: 'right',
        }}
      >
        <Space>{right}</Space>
      </Col>
    </Row>
  );
};

export default LeftRightSlot;
