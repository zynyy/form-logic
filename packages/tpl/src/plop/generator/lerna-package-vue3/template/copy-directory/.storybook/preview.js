import 'element-plus/theme-chalk/index.css';
import { setup } from '@storybook/vue3';
import ElementPlus from 'element-plus';

setup((app) => {
  app.use(ElementPlus);
});

if (typeof window.global === 'undefined') {
  window.global = window;
}

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};
