import { useEffect, useReducer, useState } from 'react';
import { TablePipeline, TablePipelineCtx } from '@/components/ali-react-table/pipeline/pipeline';

export const useForceUpdate = () => {
  const [_, forceUpdate] = useReducer((x) => x + 1, 0);

  return forceUpdate;
};

export const useTablePipeline = (ctx?: Partial<TablePipelineCtx>) => {
  const [state, setState] = useState<any>({});
  const [tablePipeline] = useState(new TablePipeline({ state, setState, ctx }));

  useEffect(() => {
    tablePipeline.useStep();
  }, [state]);

  return tablePipeline;
};
