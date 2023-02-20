import DrawerPageForm from './DrawerPageForm';
import { pluginFactory } from '@/utils/plugins';

export * from './interface';

export default DrawerPageForm;

export const drawerPageFormPlugin = pluginFactory({
  components: {
    DrawerPageForm,
  },
});

declare module 'vue' {
  // Volar
  export interface GlobalComponents {
    DrawerPageForm: typeof DrawerPageForm;
  }
}
