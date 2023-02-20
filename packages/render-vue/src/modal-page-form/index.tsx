import ModalPageForm from './ModalPageForm';
import { pluginFactory } from '@/utils/plugins';

export * from './interface';

export default ModalPageForm;

export const modalPageFormPlugin = pluginFactory({
  components: {
    ModalPageForm,
  },
});

declare module 'vue' {
  // Volar
  export interface GlobalComponents {
    ModalPageForm: typeof ModalPageForm;
  }
}
