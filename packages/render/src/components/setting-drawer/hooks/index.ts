import { settingDrawerStyle } from '../style';
import { useComponentStyle } from '@formlogic/component';

export const useSettingDrawerStyle = () => {
  return useComponentStyle('setting-drawer', settingDrawerStyle);
};
