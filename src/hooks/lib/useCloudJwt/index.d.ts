/// <reference types="react" />
export declare const JWT_KEY = "__byted_hook_jwt";
export declare const JWT_URL = "https://cloud.bytedance.net/auth/api/v1/jwt";
export declare type JwtInfo = {
    exp: number;
    email: string;
    username: string;
    avatar_url: string;
    organization: string;
};
declare const useCloudJwt: (initToken?: string, useInitToken?: boolean) => [string, import("react").Dispatch<import("react").SetStateAction<string>>, {
    refreshJwt: () => void;
    fetchJwt: () => Promise<string>;
    parseJwt: (token: string) => JwtInfo | undefined;
    checkJwt: (token?: string | undefined) => boolean;
}];
/**
 * 检查 JWT 是否有效
 */
declare function checkJwt(token?: string): boolean;
export declare function parseJwt(token: string): JwtInfo | undefined;
declare function fetchJwt(): Promise<string>;
export default useCloudJwt;
