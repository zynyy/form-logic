import style from '../style';

import { useComponentStyle } from '@formlogic/component';

export const useFormItemStyle = () => {
  return useComponentStyle('form-item', style);
};

