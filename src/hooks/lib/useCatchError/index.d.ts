import React from 'react';
declare type ErrorState = {
    hasError: boolean;
    error: any;
    errorInfo: any;
};
declare const _default: (renderFallback?: ((error: any) => React.ReactNode) | undefined) => [React.FC, ErrorState];
export default _default;
