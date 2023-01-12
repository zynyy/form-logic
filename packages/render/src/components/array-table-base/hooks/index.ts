import style from '../style';

import { useComponentStyle } from '@formlogic/component';

export {SortableContext, useSortableContext} from './context'

export const useArrayTableBaseStyle = () => {
  return useComponentStyle('array-table-base', style);
};
