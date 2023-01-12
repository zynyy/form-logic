import { createContext, useContext } from 'react';
import { ChartPatternType, LogicProcessConfig } from '@/interface';
import { MonacoEditorLoaderConfig } from '@formlogic/component';

export interface ChartLayoutValueContext {
  mode?: string;
  pattern?: ChartPatternType;
  logicProcessConfig?: LogicProcessConfig;
  monacoEditorLoaderConfig?: MonacoEditorLoaderConfig;
}

export const ChartLayoutContext = createContext<ChartLayoutValueContext>({});

export const useChartLayoutContext = () => {
  return useContext(ChartLayoutContext);
};
