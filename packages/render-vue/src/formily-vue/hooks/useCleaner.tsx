import { useInjectionCleaner } from './useInjectionCleaner';
import {FormSymbol} from "@/formily-vue/components/form-provider/hooks";
import {FieldSymbol} from "@/formily-vue/components/field/hooks";


export const useCleaner = () => {
  useInjectionCleaner([FormSymbol, FieldSymbol]);
};
