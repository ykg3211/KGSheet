export declare type CachedKeyType = string;
export declare type CacheStoreType = 'memory' | 'localStorage';
declare class BaseCache<T extends {
    [key: string]: any;
}> {
    protected value: Map<CachedKeyType, T> | Storage;
    private type;
    constructor();
    changeType: (type: CacheStoreType) => void;
    getValue: (key: CachedKeyType) => T;
    setValue: (key: CachedKeyType, data: T) => void;
    removeItem: (key: CachedKeyType) => void;
}
export default BaseCache;
