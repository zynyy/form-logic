import { Col, Row, RowProps, Space } from 'ant-design-vue';

import cls from 'classnames';
import { defineComponent } from 'vue';
import { useStylePrefixCls } from '@/components/style/hooks';
import { rowProps } from 'ant-design-vue/es/grid/Row';

const LeftRightSlot = defineComponent({
  name: 'LeftRightSlot',
  props: rowProps(),
  slots: ['left', 'right'],
  setup(props, { slots }) {
    const prefixCls = useStylePrefixCls('left-right-slot');
    return () => {
      return (
        <Row gutter={12} {...props} class={cls(prefixCls)}>
          <Col span={12} class={cls(`${prefixCls}-left`)}>
            <Space>{slots.left?.()}</Space>
          </Col>
          <Col span={12} class={cls(`${prefixCls}-right`)}>
            <Space>{slots.right?.()}</Space>
          </Col>
        </Row>
      );
    };
  },
});

export default LeftRightSlot;
