import { createContext } from 'react';
import { FlowChartEditorContextType } from './interface';
import { MONACO_EDITOR_PATHS_VS } from '@/utils/constant';

export const FlowChartEditorContext = createContext<FlowChartEditorContextType>({
  processConfig: {
    code: '',
    name: '',
    pageCode: '',
    detailApi: '',
    updateApi: '',
  },
  monacoEditorLoaderConfig: {
    paths: {
      vs: MONACO_EDITOR_PATHS_VS,
    },
  },
});
