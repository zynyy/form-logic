import SchemeForm from './SchemeForm';
import { pluginFactory } from '@/utils/plugins';

export * from './hooks';

export default SchemeForm;

export * from './interface';

export const schemeFormPlugin = pluginFactory({
  components: {
    SchemeForm,
  },
});
declare module 'vue' {
  // Volar
  export interface GlobalComponents {
    SchemeForm: typeof SchemeForm;
  }
}
