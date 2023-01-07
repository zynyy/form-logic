import { getDraggableModalStyle } from '@/draggable-modal/style';

import { useComponentStyle } from '@/hooks/useComponentStyle';

export const useDraggableModalStyle = () => {
  return useComponentStyle('draggable-modal', getDraggableModalStyle);
};
