import { isObservable } from '@formily/reactive';

const collectData = (vm: any, data?: any) => {
  const dataDefinition = typeof data === 'function' ? data.call(vm, vm) : data || {};

  return Object.keys(dataDefinition).reduce((result: any, field) => {
    const value = dataDefinition[field];

    if (isObservable(value)) {
      Object.defineProperty(vm, field, {
        configurable: true,
        get() {
          return value;
        },
        set() {},
      });
    } else {
      result[field] = value;
    }

    return result;
  }, {});
};

export default collectData;
