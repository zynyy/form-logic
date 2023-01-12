import { genStyleHook } from '@formlogic/component';

export const formLayoutStyle = genStyleHook('form-layout', (token) => {
  const { componentCls } = token || {};

  return {
    [componentCls]: {
      display: 'flex',
      'flexDirection': 'column',
      gap: '10px',
    },
  };
});

