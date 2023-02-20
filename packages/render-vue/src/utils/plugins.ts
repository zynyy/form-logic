import { Component, Directive, Plugin, App } from 'vue';

export const camelCaseToHyphen = (str) => {
  return str.replace(/(?<=[A-Za-z0-9])(?=[A-Z])/g, '-').toLowerCase();
};

export interface FactoryOptions {
  components?: Record<string, Component>;
  directives?: Record<string, Directive>;
  plugins?: Record<string, Plugin>;
}

export const installFactory = ({ components, directives, plugins }: FactoryOptions) => {
  const install = (Vue, config = {}) => {
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

export const registerPlugins = (Vue, plugins = {}) => {
  for (const plugin in plugins) {
    if (plugin && plugins[plugin]) {
      Vue.use(plugins[plugin]);
    }
  }
};

export const registerComponent = (Vue: App, name, component) => {
  if (Vue && name && component) {
    Vue.component(name, component);
    Vue.component(camelCaseToHyphen(name), component);
  }
};

export const registerComponents = (Vue: App, components = {}) => {
  for (const component in components) {
    registerComponent(Vue, component, components[component]);
  }
};

export const registerDirective = (Vue: App, name, directive) => {
  if (Vue && name && directive) {
    Vue.directive(name, directive);
  }
};

export const registerDirectives = (Vue: App, directives = {}) => {
  for (const directive in directives) {
    registerDirective(Vue, directive, directives[directive]);
  }
};
