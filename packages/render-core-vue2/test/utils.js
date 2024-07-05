import { nextTick } from 'vue';

export const asyncExpect = (fn, timeout) => {
  return new Promise((resolve) => {
    if (typeof timeout === 'number') {
      setTimeout(() => {
        fn();
        resolve();
      }, timeout);
    } else {
      nextTick(() => {
        fn();
        resolve();
      });
    }
  });
};
