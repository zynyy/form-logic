import ListLayout from './ListLayout';
import { pluginFactory } from '@/utils/plugins';

export * from './hooks';

export default ListLayout;

export const listLayoutPlugin = pluginFactory({
  components: {
    ListLayout,
  },
});

export * from './interface';

declare module 'vue' {
  // Volar
  export interface GlobalComponents {
    ListLayout: typeof ListLayout;
  }
}
