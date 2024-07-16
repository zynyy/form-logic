if (typeof window.global === 'undefined') {
  window.global = window;
}
import Vue from 'vue';




// This looks like it doesn't do anything, but I kept it since it would technically be the standard
// way to do this. What really did the trick though was the decorator.


import VueRouter from 'vue-router';

import CodeRender, { TransformsSchema } from '../src';

TransformsSchema.registerPermissionVerification((authCode, record) => {
  return true;
});

const createRouter = () =>
  new VueRouter({
    mode: 'history', // require service support
    scrollBehavior: () => ({
      y: 0,
    }),
    routes: [],
  });
Vue.use(VueRouter);

const router = createRouter();

Vue.extend({ i18n, router });

export const decorators = [
  (story) => ({
    components: { story },
    i18n, // this is the essential part to have t() and Co. in your components
    router,
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
