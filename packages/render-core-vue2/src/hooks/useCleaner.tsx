import { FieldSymbol } from '@/field/hooks';
import { FormSymbol } from '@/form-provider/hooks';

import { useInjectionCleaner } from './useInjectionCleaner';

export const useCleaner = () => {
  useInjectionCleaner([FormSymbol, FieldSymbol]);
};
