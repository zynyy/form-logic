import { defineComponent } from 'vue';
import { useStylePrefixCls } from '@/components/style/hooks';
import { Spin } from 'ant-design-vue';
import cls from 'classnames';
import { getLayoutProps } from '@/components/layout/interface';

const Layout = defineComponent({
  name: 'Layout',
  props: getLayoutProps(),
  slots: ['header', 'footer'],
  setup(props, { slots }) {
    const prefixCls = useStylePrefixCls('layout');

    return () => {
      const { loading, style, height } = props;

      const renderHeader = () => {
        if (!slots.header) {
          return null;
        }

        return <div class={cls(`${prefixCls}-header`)}>{slots.header()}</div>;
      };

      const renderFooter = () => {
        if (!slots.footer) {
          return null;
        }

        return <div class={cls(`${prefixCls}-footer`)}>{slots.footer()}</div>;
      };

      return (
        <Spin spinning={loading}>
          <div
            class={cls(props.class, prefixCls, `${prefixCls}-wrapper`)}
            style={{ ...style, height }}
          >
            {renderHeader()}
            <div class={cls(`${prefixCls}-body`)}>{slots?.default()}</div>
            {renderFooter()}
          </div>
        </Spin>
      );
    };
  },
});

export default Layout
