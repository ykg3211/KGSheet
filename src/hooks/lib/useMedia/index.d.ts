import type { MediaQueryObject } from './types';
export declare const mockMediaQueryList: MediaQueryList;
declare const useMedia: (rawQuery: string | MediaQueryObject, defaultState?: boolean | (() => boolean)) => boolean;
export default useMedia;
