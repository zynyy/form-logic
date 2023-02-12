import { defineComponent } from "vue";

import type { App, Component } from "vue";

export interface DemoProps {
  name: string;
}

const Demo = defineComponent({
  props: {
    name: {
      type: String,
      required: true,
    },
  },
  setup(props: DemoProps) {
    return () => {
      return <div>6666</div>;
    };
  },
});

export type WithInstall<T> = T & {
  install(app: App): void;
};
const withInstall = <T extends Component>(component: T) => {
  (component as Record<string, unknown>).install = (app: App) => {
    const { name } = component;
    if (name) {
      app.component(name, component);
    }
  };

  return component as T;
};

const InstallDemo = Demo

export {InstallDemo, Demo}


