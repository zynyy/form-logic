import { autorun } from '@formily/reactive';
import {
  ComputedGetter,
  ComputedRef,
  onBeforeUnmount,
  shallowRef,
  computed as vueComputed,
} from 'vue';
import { VNode } from 'vue/types/umd';

export const composeExport = <T0 extends {}, T1 extends {}>(s0: T0, s1: T1): T0 & T1 => {
  return Object.assign(s0, s1);
};

export const css2Obj = (css: string) => {
  const r = /(?<=^|;)\s*([^:]+)\s*:\s*([^;]+)\s*/g;
  const o: Record<string, any> = {};
  css.replace(r, (m: any, p: any, v: any) => (o[p] = v));
  return o;
};

export function cloneElement(VNode: VNode, props = {}) {
  const attrs = { ...VNode.data?.attrs, ...props };
  const data = { ...VNode.data, attrs };

  return { ...VNode, data };
}

export const isVueComponent = (component: any) => {
  if (!component) {
    return false;
  }

  return typeof component.render === 'function' || typeof component.setup === 'function';
};

const isObj = (val: unknown): val is any => typeof val === 'object';

export function isVNode(val: unknown): (val: unknown) => val is VNode {
  return isObj(val) && val?.context?._isVue;
}

export const reactiveComputed = <T>(calc: ComputedGetter<T>): ComputedRef<T> => {
  const temp = shallowRef<T>();
  let dispose: () => void;
  onBeforeUnmount(() => dispose?.());
  return vueComputed<T>((ctx?: any) => {
    dispose?.();
    dispose = autorun(() => (temp.value = calc(ctx)));
    return temp.value as T;
  });
};
