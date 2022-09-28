export declare const pad: (value: number) => string;
export declare const getRemainingTime: (deadline: number) => number;
export declare const formatTime: (time: number, isAbs?: boolean) => {
    remainingTime: number;
    seconds: string;
    minutes: string;
    hours: string;
    days: string;
};
