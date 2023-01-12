import { DependencyList, EffectCallback, useEffect, useRef } from 'react';

import isEqual from 'lodash.isequal';

const useDeepEffect = (effect: EffectCallback, deps: DependencyList) => {
  const depsRef = useRef<DependencyList>(deps);
  const depsChangeNum = useRef<number>(0);

  if (!isEqual(deps, depsRef.current)) {
    depsRef.current = deps;
    depsChangeNum.current += 1;
  }

  useEffect(effect, [depsChangeNum.current]);
};

export default useDeepEffect;
