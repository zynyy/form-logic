import { merge } from 'lodash-es';
import Vue, { AsyncComponent, Component, ComponentOptions } from 'vue';

import { MergeStrategy } from '@/interface';

export type UpdateComponentProps = (
  nextProps: Record<string, any>,
  strategy?: MergeStrategy,
) => void;

export interface CreateComponentConfig {
  props?: Record<string, any>;
  event?: Record<string, Function>;
  updateProps: UpdateComponentProps;
}

const createComponent = (
  name: string,
  component: Component | AsyncComponent,
  config?: Partial<CreateComponentConfig>,
) => {
  const newComponentOptions: ComponentOptions<Vue> = {
    name,
    data() {
      const { props } = config || {};
      return { component: undefined, componentProps: props };
    },
    methods: {
      updateComponentProps(nextProps: Record<string, any>, strategy?: MergeStrategy) {
        if (strategy === 'overwrite') {
          this.$set(this, 'componentProps', nextProps);
        } else {
          this.$set(
            this,
            'componentProps',
            // @ts-ignore
            merge({}, this.componentProps, nextProps),
          );
        }
      },
    },
    async created() {
      const { updateProps } = config || {};

      if (updateProps) {
        // @ts-ignore
        updateProps?.(this.updateComponentProps);
      }

      if (component instanceof Promise) {
        try {
          const module = await component;
          // @ts-ignore
          this.component = module?.default;
        } catch (error) {
          console.error(`无法加载 ${name} 组件, error:`, error);
        }
        return;
      }
      // @ts-ignore
      this.component = component;
    },
    render(h) {
      const { event } = config || {};
      // @ts-ignore
      return this.component
        ? // @ts-ignore
          h(this.component, {
            // @ts-ignore
            attrs: this.componentProps,
            on: event,
          })
        : null;
    },
  };

  return newComponentOptions;
};

export default createComponent;
