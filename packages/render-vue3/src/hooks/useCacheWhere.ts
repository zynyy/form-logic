import { AnyObject } from '@/interface';
import store from 'store2';

export interface CacheWhere {
  current: number;
  pageSize: number;
  params: AnyObject;
}

const useCacheWhere = (
  getCacheKey: () => string,
): [(nextCache: CacheWhere) => void, () => CacheWhere] => {
  const setCache = (nextCache: CacheWhere) => {
    const cacheKey = getCacheKey();
    store.session.set(cacheKey, nextCache);
  };

  const getCache = (): CacheWhere => {
    const cacheKey = getCacheKey();
    return (
      store.session.get(cacheKey) || {
        current: 1,
        pageSize: 30,
        params: {},
      }
    );
  };

  return [setCache, getCache];
};

export default useCacheWhere;
