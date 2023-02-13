import { withInstall } from '@/utils';
import _SchemeForm from './SchemeForm';

export * from './hooks'

export const SchemeForm = withInstall(_SchemeForm);
export default SchemeForm;

export * from './interface';

declare module 'vue' {
  // Volar
  export interface GlobalComponents {
    SchemeForm: typeof _SchemeForm;
  }
}
