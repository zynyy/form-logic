import _ModalPageForm from './ModalPageForm';
import { withInstall } from '@/utils';

const ModalPageForm = withInstall(_ModalPageForm);

export * from './interface';

export default ModalPageForm;

declare module 'vue' {
  // Volar
  export interface GlobalComponents {
    ModalPageForm: typeof _ModalPageForm;
  }
}
