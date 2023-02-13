import { inject, InjectionKey, provide } from 'vue';
import { IGridOptions } from '@formily/grid';

export interface FormGridValueContext extends IGridOptions {}

export const FormGridContextSymbol: InjectionKey<FormGridValueContext> =
  Symbol('FormGridContextSymbol');

export const provideFormGrid = (formGrid: FormGridValueContext) => {
  provide(FormGridContextSymbol, formGrid);
};

export const useFormGrid = () => inject(FormGridContextSymbol);
