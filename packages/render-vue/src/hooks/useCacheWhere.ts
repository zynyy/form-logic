import store from 'store2';
import { AnyObject } from '@/interface';

interface CacheWhere {
  current: number;
  pageSize: number;
  params: AnyObject;
}

const useCacheWhere = (cacheKey: string): [(nextCache: CacheWhere) => void, () => CacheWhere] => {
  const setCache = (nextCache: CacheWhere) => {
    store.session.set(cacheKey, nextCache);
  };

  const getCache = (): CacheWhere => {
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
