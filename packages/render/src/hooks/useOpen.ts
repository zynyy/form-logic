import { useState } from 'react';

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
