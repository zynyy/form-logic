import { each, globalThisPolyfill, isPlainObj } from '@/utils';

export const lowerSnake = (str: string) => {
  return String(str).replace(/\s+/g, '_').toLocaleLowerCase();
};

export const mergeLocales = (target: any, source: any) => {
  if (isPlainObj(target) && isPlainObj(source)) {
    each(source, function (value, key) {
      const token = lowerSnake(key);
      // @ts-ignore
      const messages = mergeLocales(target[key] || target[token], value);
      // @ts-ignore
      target[token] = messages;
    });
    return target;
  } else if (isPlainObj(source)) {
    const result = Array.isArray(source) ? [] : {};
    each(source, function (value, key) {
      const messages = mergeLocales(undefined, value);
      // @ts-ignore
      result[lowerSnake(key)] = messages;
    });
    return result;
  }
  return source;
};

export const getBrowserLanguage = () => {
  /* istanbul ignore next */
  if (!globalThisPolyfill.navigator) {
    return 'en';
  }

  return (
    // @ts-ignore
    globalThisPolyfill.navigator['browserlanguage'] ||
    globalThisPolyfill.navigator?.language ||
    'en'
  );
};
