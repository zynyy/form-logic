import { withInstall } from '@/utils';

import _Field from './Field';
import _ArrayField from './ArrayField';
import _ObjectField from './ObjectField';
import _VoidField from './VoidField';

export const Field = withInstall(_Field);
export const ArrayField = withInstall(_ArrayField);
export const ObjectField = withInstall(_ObjectField);
export const VoidField = withInstall(_VoidField);

export type { FieldProps, ArrayFieldProps, ObjectFieldProps, VoidFieldProps } from './interface';

export {
  getFieldProps,
  getVoidFieldProps,
  getObjectFieldProps,
  getArrayFieldProps,
} from './interface';

export { useField, provideField } from './hooks';

declare module 'vue' {
  export interface GlobalComponents {
    Field: typeof Field;
    ArrayField: typeof ArrayField;
    ObjectField: typeof ObjectField;
    VoidField: typeof VoidField;
  }
}
