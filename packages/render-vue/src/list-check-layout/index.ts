import { withInstall } from '@/utils';
import _ListCheckLayout from './ListCheckLayout';

const ListCheckLayout = withInstall(_ListCheckLayout);

export * from './interface';

export default ListCheckLayout;

declare module 'vue' {
  // Volar
  export interface GlobalComponents {
    ListCheckLayout: typeof _ListCheckLayout;
  }
}
