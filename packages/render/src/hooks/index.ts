import { useCallback, useLayoutEffect, useMemo, useRef } from 'react';

export { useCreateForm } from './useCreateForm';

export { useReloadFlag } from '@/hooks/useReloadFlag';

export { useFormSchema } from './useFormSchema';
export { useListSchema } from './useListSchema';
export { useDynamicSchema } from './useDynamicSchema';

export { useBindBtnClick, useBindLogic, useTriggerLogic } from './useLogic';

export { useOpen } from './useOpen';

export { useJsonMetaSchema } from './useJsonMetaSchema';

export type { TransformsOptionsArgs } from './useTransformsOptions';
export { useTransformsOptions } from './useTransformsOptions';
export { useNotifyTransformOptionsChange } from './useNotifyTransformOptionsChange';

export { default as useArrayTableColumns } from './useArrayTableColumns';
export { default as useArrayTableSources } from './useArrayTableSources';
export { default as useSchemaBtn } from './useSchemaBtn';
export { default as usePropertiesSources } from './usePropertiesSources';
export { default as useGroupSchemaBtn } from './useGroupSchemaBtn';

export { default as useSchemaComponentsContext } from './useSchemaComponentsContext';

export { default as usePageForm} from './usePageForm'
export { default as useForceUpdate} from './useForceUpdate'

export { default as useCacheWhere} from './useCacheWhere'


export const useLatestFn = (handlerFn: (...arg: any) => void) => {
  const handlerRef = useRef((..._arg: any) => {});

  useLayoutEffect(() => {
    handlerRef.current = handlerFn;
  });

  return useCallback((...args) => {
    const fn = handlerRef.current;
    return fn?.(...args);
  }, []);
};

export const useDevEnv = () => {
  return useMemo(() => {
    return process.env.NODE_ENV === 'development';
  }, []);
};
