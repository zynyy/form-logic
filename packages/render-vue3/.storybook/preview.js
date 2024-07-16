import { setup } from '@storybook/vue3';
import ElementPlus from 'element-plus';

import 'element-plus/dist/index.css'

import zhCnPlus from 'element-plus/dist/locale/zh-cn.mjs';

import { computed, ref } from 'vue';
import { merge } from 'lodash-es';
setup((app) => {
  app.use(ElementPlus);
});

const preview = {
  decorators: [
    (story) => ({
      components: { story },
      setup() {
        const language = ref('zh-cn');

        const locale = computed(() => {
          return language.value === 'zh-cn' ? merge(zhCnPlus, zhCnCube) : en;
        });

        const toggle = () => {
          language.value = language.value === 'zh-cn' ? 'en' : 'zh-cn';
        };

        return {
          language,
          locale,
          toggle,
        };
      },
      template: '<story />',
    }),
  ],
};

if (typeof window.global === 'undefined') {
  window.global = window;
}

export const parameters = {
  actions: {},
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};

export default preview;
