import _DrawerPageForm from './DrawerPageForm';
import { withInstall } from '@/utils';

const DrawerPageForm = withInstall(_DrawerPageForm);

export * from './interface';

export default DrawerPageForm;

declare module 'vue' {
  // Volar
  export interface GlobalComponents {
    ModalPageForm: typeof _DrawerPageForm;
  }
}
