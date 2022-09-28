import type { SearchRequestFnType, SearchReturnValue, SearchOptions } from './types';
export type { SearchRequestFnType, SearchReturnValue, SearchOptions };
declare function useSearch<D, V = string>(requestFn: SearchRequestFnType<D, V>, options?: SearchOptions<D, V>): SearchReturnValue<D, V>;
export default useSearch;
