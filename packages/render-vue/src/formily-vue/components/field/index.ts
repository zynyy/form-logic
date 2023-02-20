import Field from './Field';
import ArrayField from './ArrayField';
import ObjectField from './ObjectField';
import VoidField from './VoidField';

export type { FieldProps, ArrayFieldProps, ObjectFieldProps, VoidFieldProps } from './interface';

export {
  getFieldProps,
  getVoidFieldProps,
  getObjectFieldProps,
  getArrayFieldProps,
} from './interface';

export { useField, provideField } from './hooks';

export { Field, VoidField, ArrayField, ObjectField };

declare module 'vue' {
  export interface GlobalComponents {
    Field: typeof Field;
    ArrayField: typeof ArrayField;
    ObjectField: typeof ObjectField;
    VoidField: typeof VoidField;
  }
}
