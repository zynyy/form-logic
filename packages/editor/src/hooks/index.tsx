import { useState, useEffect } from 'react';

import { getLogicDetail } from '@/service';

export {
  useRefreshEffectHook,
  useRefreshLogicProcess,
  useRefreshPageData,
  useEmitPageData,
  useEmitEffectHook,
  useEmitLogicProcess,
} from './useRefreshData';

export { useFlowChartGraph } from './useFlowChartGraph';

export { useCreateRightNode } from './useCreateRightNode';

export { useLogicEffectHookProcessChartGraph } from './useLogicEffectHookProcessChartGraph';

export { useLogicCreateNode } from './useLogicCreateNode';
export { useGagreLayout } from './useGagreLayout';
export { useLabelOptions } from './useLabelOptions';

export { useDownUp } from './useDownUp';
export { useMode, useLogicEffectHookModeData } from './useMode';


export const useOpen = (): [boolean, () => void, () => void] => {
  const [open, setOpen] = useState(() => {
    return false;
  });

  const show = () => {
    setOpen(true);
  };

  const hidden = () => {
    setOpen(false);
  };

  return [open, show, hidden];
};

export const useLogicDetail = (code, belongCode) => {
  const [loading, setLoading] = useState(false);
  const [flowJson, setFlowJson] = useState(undefined);

  useEffect(() => {
    if (code) {
      setLoading(true);

      getLogicDetail({ code, belongCode })
        .then((res) => {
          const { data } = res || {};

          setFlowJson(data);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [code, belongCode]);

  return [loading, flowJson];
};
