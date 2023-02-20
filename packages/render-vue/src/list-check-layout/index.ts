import ListCheckLayout from './ListCheckLayout';
import {pluginFactory} from "@/utils/plugins";

export * from './interface';

export default ListCheckLayout;


export const listCheckLayoutPlugin = pluginFactory({
  components: {
    ListCheckLayout,
  },
});


declare module 'vue' {
  // Volar
  export interface GlobalComponents {
    ListCheckLayout: typeof ListCheckLayout;
  }
}
