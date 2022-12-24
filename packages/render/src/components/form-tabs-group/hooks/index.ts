import { usePrefixCls } from '@/components/hooks';
import style from '../style';

import { UseStyleReturnType } from '@/interface';

export const useFormTabsGroupStyle = (): UseStyleReturnType => {
  const prefixCls = usePrefixCls("formily-form-tabs-group");

  const [warpSSR, hashId] = style(prefixCls);

  return [warpSSR, hashId, prefixCls];
};
