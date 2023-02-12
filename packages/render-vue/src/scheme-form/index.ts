import { withInstall } from '@/utils';
import _SchemeForm from './SchemeForm';

export const SchemeForm = withInstall(_SchemeForm);
export default SchemeForm;

export { schemeFormProps } from './interface';

declare module 'vue' {
  // Volar
  export interface GlobalComponents {
    SchemeForm: typeof _SchemeForm;
  }
}
