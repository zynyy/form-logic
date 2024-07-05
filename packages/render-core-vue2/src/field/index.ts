import ArrayField from './ArrayField';
import Field from './Field';
import ObjectField from './ObjectField';
import VoidField from './VoidField';

export { provideField, useField } from './hooks';
export {
  getArrayFieldProps,
  getFieldProps,
  getObjectFieldProps,
  getVoidFieldProps,
} from './interface';
export type { ArrayFieldProps, FieldProps, ObjectFieldProps, VoidFieldProps } from './interface';

export { ArrayField, Field, ObjectField, VoidField };

declare module 'vue' {
  export interface GlobalComponents {
    Field: typeof Field;
    ArrayField: typeof ArrayField;
    ObjectField: typeof ObjectField;
    VoidField: typeof VoidField;
  }
}
