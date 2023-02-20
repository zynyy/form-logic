export * from './interface';

import WhereLayout from './WhereLayout';

export default WhereLayout;

declare module 'vue' {
  // Volar
  export interface GlobalComponents {
    WhereLayout: typeof WhereLayout;
  }
}
