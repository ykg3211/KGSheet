import type { BaseRequestFnType, BaseReturnValue, BaseOptions } from './types';
declare const useBaseRequest: <D, P extends any[]>(requestFn: BaseRequestFnType<D, P>, options?: BaseOptions<D, P>) => BaseReturnValue<D, P>;
export default useBaseRequest;
