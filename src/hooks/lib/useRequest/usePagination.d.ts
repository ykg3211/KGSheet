import type { PaginationData, PaginationParams, PaginationRequestFnType, PaginationReturnValue, PaginationOptions, PaginationItemType } from './types';
export type { PaginationData, PaginationParams, PaginationRequestFnType, PaginationReturnValue, PaginationOptions, PaginationItemType, };
declare function usePagination<D extends PaginationData>(requestFn: PaginationRequestFnType<D>, options?: PaginationOptions<D>): PaginationReturnValue<D>;
export default usePagination;
