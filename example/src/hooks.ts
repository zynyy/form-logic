import { useEffect, useState } from 'react';

export const useOpen = (tip: string): [boolean, () => void, () => void] => {
  const [open, setOpen] = useState(() => {
    return false;
  });

  const show = () => {
    console.log(tip, 'show');
    setOpen(true);
  };

  const hidden = () => {
    console.log(tip, 'hidden');
    setOpen(false);
  };

  useEffect(() => {
    console.log(`${tip}状态${open}`);
  }, [open, tip]);

  return [open, show, hidden];
};
