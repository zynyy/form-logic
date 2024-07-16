import { ConfigProvider, theme } from 'antd';
import { useContext } from 'react';

const { useToken } = theme;
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

// @ts-ignore
export const useAntdThemeToken = useToken;
