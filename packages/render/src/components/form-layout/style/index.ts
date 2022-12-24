import { genStyleHook } from '@/style/styleHook';

const style = genStyleHook('form-layout', (token) => {
  const { componentCls } = token || {};

  return {
    [componentCls]: {
      display: 'flex',
      'flexDirection': 'column',
      gap: '10px',
    },
  };
});

export default style;
