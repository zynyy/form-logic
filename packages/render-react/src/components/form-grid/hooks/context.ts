import { createContext, useContext } from 'react';
import { IGridOptions } from '@formily/grid';


export interface FormGridValueContext extends IGridOptions {}



export const FormGridContext = createContext<FormGridValueContext>(null);


export const useFormGrid = () => useContext(FormGridContext);
