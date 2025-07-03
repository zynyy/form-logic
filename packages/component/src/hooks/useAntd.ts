import { ConfigProvider, theme } from 'antd';
import { useContext } from 'react';

export const useAntdThemeToken: typeof theme.useToken = theme.useToken;

const { ConfigContext } = ConfigProvider;

export const useAntdConfig = () => {
  return useContext(ConfigContext);
};

export const usePrefixCls = (
  tag?: string,
  props?: {
    prefixCls?: string;
  },
) => {
  if ('ConfigContext' in ConfigProvider) {
    const { getPrefixCls } = useAntdConfig();
    return getPrefixCls(tag, props?.prefixCls);
  } else {
    const prefix = props?.prefixCls ?? 'ant-';
    return `${prefix}${tag ?? ''}`;
  }
};
