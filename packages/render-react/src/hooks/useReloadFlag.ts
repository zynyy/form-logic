import { useState } from 'react';

 export const useReloadFlag = (): [number, () => void] => {
  const [reloadFlag, setReloadFlag] = useState<number>(0);

  const refreshFlag = () => {
    setReloadFlag((prev) => prev + 1);
  };

  return [reloadFlag, refreshFlag];
};


