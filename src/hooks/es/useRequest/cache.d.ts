import { CachedKeyType, CacheStoreType } from './baseCache';
export declare type cachedData = {
    data: any;
    timer: Timer | undefined;
    startTime: number;
};
declare type Timer = ReturnType<typeof setTimeout>;
declare const setCache: (key: CachedKeyType, cacheTime: number, data: any) => void;
declare const getCache: (key: CachedKeyType) => {
    data: any;
    startTime: number;
};
declare const changeCacheType: (type: CacheStoreType) => void;
export { getCache, setCache, changeCacheType };
