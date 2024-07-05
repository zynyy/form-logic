import { setup } from '@storybook/vue3';
import ElementPlus from 'element-plus';
import 'element-plus/theme-chalk/src/index.scss';

setup((app) => {
  app.use(ElementPlus);
});

if (typeof window.global === 'undefined') {
  window.global = window;
}

// This looks like it doesn't do anything, but I kept it since it would technically be the standard
// way to do this. What really did the trick though was the decorator.

export const decorators = [
  (story) => ({
    components: { story },
    template: '<story />',
  }),
];

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};
