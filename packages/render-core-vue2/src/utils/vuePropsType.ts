import type { PropType } from 'vue';

import { DataIndex, VueNode } from '@/interface';

export const makeRequiredProp = <T>(type: T) => ({
  type,
  required: true as const,
});

export const stringType = <T extends string = string>(defaultVal?: T) => {
  return {
    type: String as unknown as PropType<T>,
    default: defaultVal as T,
  };
};

export const strNumType = <T = any>(defaultVal?: T) => {
  return {
    type: [String, Number] as unknown as PropType<T>,
    default: defaultVal as T,
  };
};

export const numberType = (defaultVal?: number) => {
  return {
    type: Number,
    default: defaultVal,
  };
};

export const arrayType = <T extends any[]>(defaultVal?: T) => {
  return {
    type: Array as unknown as PropType<T>,
    default: () => {
      return defaultVal as T;
    },
  };
};

export const objectType = <T = {}>(defaultVal?: T) => {
  return {
    type: Object as PropType<T>,
    default: () => {
      return defaultVal as T;
    },
  };
};

export const booleanType = (defaultVal?: boolean) => {
  return {
    type: Boolean,
    default: defaultVal as boolean,
  };
};

export const functionType = <T = () => void>(defaultVal?: T) => {
  return {
    type: Function as PropType<T>,
    default: defaultVal as T,
  };
};

export const dataPathType = (defaultVal?: DataIndex) => {
  return {
    type: [String, Number, Array] as PropType<DataIndex>,
    default: defaultVal as DataIndex,
  };
};

// https://stackoverflow.com/questions/46176165/ways-to-get-string-literal-type-of-array-values-without-enum-overhead
export const tuple = <T extends string[]>(...args: T) => args;

export const eventType = <T>() => {
  return { type: [Function, Array] as PropType<T | T[]> };
};

export const anyType = <T = any>(defaultVal?: T, required?: boolean) => {
  const type = {
    validator: () => true,
    default: defaultVal as T,
  } as unknown;

  if (required) {
    return type as {
      type: PropType<T>;
      default: T;
      required: true;
    };
  }

  return type as {
    default: T;
    type: PropType<T>;
  };
};
export const vNodeType = <T = VueNode>() => {
  return {
    validator: () => true,
  } as unknown as { type: PropType<T> };
};

export const someType = <T>(types?: any[], defaultVal?: T) => {
  return types ? { type: types as PropType<T>, default: defaultVal as T } : anyType<T>(defaultVal);
};
