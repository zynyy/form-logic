import SchemeTableForm from './SchemeTableForm';
import { pluginFactory } from '@/utils/plugins';

export default SchemeTableForm;

export * from './interface';

export const schemeTableFormPlugin = pluginFactory({
  components: {
    SchemeTableForm,
  },
});

declare module 'vue' {
  // Volar
  export interface GlobalComponents {
    SchemeTableForm: typeof SchemeTableForm;
  }
}
