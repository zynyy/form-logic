import _FormPageLayout from './FormPageLayout';
import { withInstall } from '@/utils';

const FormPageLayout = withInstall(_FormPageLayout);

export default FormPageLayout;

export * from './interface';

declare module 'vue' {
  // Volar
  export interface GlobalComponents {
    FormPageLayout: typeof _FormPageLayout;
  }
}
