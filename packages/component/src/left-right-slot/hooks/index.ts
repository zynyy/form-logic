import { leftRightSlotStyle } from '../style';

import { useComponentStyle } from '@/hooks/useComponentStyle';

export const useLeftRightSlotStyle = () => {
  return useComponentStyle('left-right-slot', leftRightSlotStyle);
};
