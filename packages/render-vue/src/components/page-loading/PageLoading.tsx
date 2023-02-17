import { defineComponent } from 'vue';
import { Spin } from 'ant-design-vue';
import { useStylePrefixCls } from '@/components/style/hooks';
import { getPageLoadingProps, PageLoadingProps } from './interface';

const PageLoading = defineComponent({
  name: 'PageLoading',
  inheritAttrs: false,
  props: getPageLoadingProps(),
  setup(props: PageLoadingProps, { slots }) {
    return () => {
      const prefixCls = useStylePrefixCls('page-loading');

      const { loading } = props;

      return (
        <Spin spinning={loading} wrapperClassName={prefixCls}>
          {slots.default()}
        </Spin>
      );
    };
  },
});

export default PageLoading;
