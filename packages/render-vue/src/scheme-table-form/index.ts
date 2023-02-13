import { withInstall } from '@/utils';
import _SchemeTableForm from './SchemeTableForm';

const SchemeTableForm = withInstall(_SchemeTableForm);

export default SchemeTableForm;

export * from './interface';


declare module 'vue' {
  // Volar
  export interface GlobalComponents {
    SchemeTableForm: typeof _SchemeTableForm;
  }
}
