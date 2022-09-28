import React from 'react';
interface IErrorBoundaryProps {
    onDidCatch: (error: any, errorInfo: any) => void;
    renderFallback?: (error: any) => React.ReactNode;
}
interface IErrorBoundaryState {
    hasError: boolean;
    error: any;
}
declare class ErrorBoundary extends React.Component<IErrorBoundaryProps, IErrorBoundaryState> {
    constructor(props: IErrorBoundaryProps);
    static getDerivedStateFromError(error: any): {
        hasError: boolean;
        error: any;
    };
    componentDidCatch(error: any, errorInfo: any): void;
    render(): {} | null | undefined;
}
export default ErrorBoundary;
