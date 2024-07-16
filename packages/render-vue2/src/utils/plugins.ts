import { VueComponent } from '@formlogic/render-core-vue2';
import Vue, { Component, Directive, PluginFunction, PluginObject } from 'vue';

export type Plugin = PluginFunction<any> | PluginObject<any>;

export type App = typeof Vue;

export const camelCaseToHyphen = (str: string) => {
  return str.replace(/(?<=[A-Za-z0-9])(?=[A-Z])/g, '-').toLowerCase();
};

export interface FactoryOptions {
  components?: Record<string, Component>;
  directives?: Record<string, Directive>;
  plugins?: Record<string, Plugin>;
}

export const installFactory = ({ components, directives, plugins }: FactoryOptions) => {
  const install = (Vue: App, config = {}) => {
    if (install.installed) {
      return;
    }
    install.installed = true;
    registerComponents(Vue, components);
    registerDirectives(Vue, directives);
    registerPlugins(Vue, plugins);
  };

  install.installed = false;

  return install;
};

export const pluginFactory = (options: FactoryOptions) => ({
  install: installFactory(options),
});

export const registerPlugins = (vue: App, plugins: Record<string, Plugin> = {}) => {
  for (const plugin in plugins) {
    if (plugin && plugins[plugin]) {
      vue.use(plugins[plugin]);
    }
  }
};

export const registerComponent = (vue: App, name: string, component: any) => {
  if (vue && name && component) {
    vue.component(`cube-${camelCaseToHyphen(name)}`, component);
    vue.component(`${name}`, component);
  }
};

export const registerComponents = (vue: App, components: Record<string, VueComponent> = {}) => {
  for (const component in components) {
    registerComponent(vue, component, components[component]);
  }
};

export const registerDirective = (vue: App, name: string, directive: Directive) => {
  if (vue && name && directive) {
    vue.directive(name, directive);
  }
};

export const registerDirectives = (vue: App, directives: Record<string, Directive> = {}) => {
  for (const directive in directives) {
    registerDirective(vue, directive, directives[directive]);
  }
};
