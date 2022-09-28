import * as Cookies from 'js-cookie';
export interface IFuncUpdater<T> {
    (previousState?: T): T;
}
declare const useCookie: <T>(key: string, defaultValue?: T | undefined, raw?: boolean) => [T | undefined, (value?: T | IFuncUpdater<T> | undefined, options?: Cookies.CookieAttributes | undefined) => void];
export default useCookie;
