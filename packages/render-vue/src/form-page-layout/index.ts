import FormPageLayout from './FormPageLayout';
import { pluginFactory } from '@/utils/plugins';

export default FormPageLayout;

export const formPageLayoutPlugin = pluginFactory({
  components: {
    FormPageLayout,
  },
});

export * from './interface';

declare module 'vue' {
  // Volar
  export interface GlobalComponents {
    FormPageLayout: typeof FormPageLayout;
  }
}
