import PageLoading from './PageLoading';

export default PageLoading;

declare module 'vue' {
  // Volar
  export interface GlobalComponents {
    PageLoading: typeof PageLoading;
  }
}
