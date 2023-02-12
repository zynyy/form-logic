import { withInstall } from '@/utils';

import _ReactiveField from './ReactiveField';

const ReactiveField = withInstall(_ReactiveField);

export default ReactiveField;

export { getReactiveFieldProps } from './interface';

export type { ReactiveFieldProps } from './interface';

declare module 'vue' {
  export interface GlobalComponents {
    ReactiveField: typeof ReactiveField;
  }
}
