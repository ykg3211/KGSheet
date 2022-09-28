/// <reference types="react" />
import { WebOptions } from '@ies/starling_client';
export interface StarlingTextsTypes {
    [key: string]: string;
}
declare type Options = {
    localLangKey?: string;
    defaultLang?: string;
    fallbackTexts?: StarlingTextsTypes;
    customTexts?: StarlingTextsTypes;
    ifMountToWindow?: boolean;
    transFnName?: string;
    isDev?: boolean;
};
declare const useStarling: (starlingConfig: WebOptions, options?: Options) => {
    trans: (key: string, format?: any) => string | (string | void)[];
    texts: {
        [x: string]: string;
    };
    starlingTexts: StarlingTextsTypes;
    loadTextsError: Error | undefined;
    lang: string;
    setLang: import("react").Dispatch<import("react").SetStateAction<string>>;
    loading: boolean;
    setLoading: import("react").Dispatch<import("react").SetStateAction<boolean>>;
};
export default useStarling;
