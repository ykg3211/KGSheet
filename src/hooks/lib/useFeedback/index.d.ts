import React from 'react';
export interface Tooltip {
    text: string;
    placement?: 'bottom-end' | 'bottom-start' | 'bottom' | 'left-end' | 'left-start' | 'left' | 'right-end' | 'right-start' | 'right' | 'top-end' | 'top-start' | 'top';
}
export declare type FeedbackLang = 'zh_CN' | 'en_US';
export interface Message {
    type: 'text' | 'questions' | 'answer';
    data: any;
    [key: string]: any;
}
export interface Handlers {
    openFeedback: () => void;
}
export interface Feedback {
    (options: FeedbackProps): void;
    start: (runCopper?: boolean, initData?: object) => void;
    setLanguage: (lang: FeedbackLang) => void;
}
export interface FeedbackProps {
    username: string;
    token: string;
    ref?: React.LegacyRef<Feedback>;
    isBusiness?: boolean;
    showButton?: boolean;
    buttonType?: 'button' | 'dial';
    text?: string;
    tooltip?: string | Tooltip;
    lang?: FeedbackLang;
    className?: string;
    style?: React.CSSProperties;
    getButtonContainer?: () => HTMLElement;
    zIndex?: number;
    maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
    capture?: boolean;
    skipCapture?: boolean;
    captureMode?: 'select' | 'intercept';
    extra?: object;
    libraryID?: number[];
    topN?: boolean | number;
    renderMessage?: (message: Message, handlers: Handlers) => React.ReactNode;
    onSubmit?: () => void;
    onStart?: () => void;
    onOk?: () => void;
    onCancel?: () => void;
    onMount?: () => void;
}
declare type Options = {
    auto?: boolean;
    username: string;
    props?: Partial<FeedbackProps>;
};
declare global {
    interface Window {
        dpFeedback?: Feedback;
    }
}
declare const useFeedback: (token: string, options: Options) => {
    open: () => void;
    setLanguage: (lang: FeedbackLang) => void;
    loaded: boolean;
    error: ErrorEvent | null;
};
export default useFeedback;
