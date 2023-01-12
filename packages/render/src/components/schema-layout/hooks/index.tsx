import { whereLayoutStyle } from '../style';

import { useComponentStyle } from '@formlogic/component';

export const useWhereLayoutStyle = () => {
  return useComponentStyle('where-layout', whereLayoutStyle);
};
