
import _ListLayout from './ListLayout';
import { withInstall } from "@/utils";
import _SchemeForm from "@/scheme-form/SchemeForm";

export * from './hooks'

const ListLayout = withInstall(_ListLayout);

export default ListLayout;

export * from './interface'


declare module 'vue' {
  // Volar
  export interface GlobalComponents {
    ListLayout: typeof _ListLayout;
  }
}
