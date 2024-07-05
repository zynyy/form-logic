import ReactiveField from './ReactiveField';
export { default as ReactiveField } from './ReactiveField';
export * from './hooks';
export { getReactiveFieldProps } from './interface';
export type { ReactiveFieldProps } from './interface';

declare module 'vue' {
  export interface GlobalComponents {
    ReactiveField: typeof ReactiveField;
  }
}
