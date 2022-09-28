import { DependencyList } from 'react';
interface Options {
    onComplete?: () => void;
    auto?: boolean;
    isCountDown?: boolean;
}
declare type CheckNumber<Time, Type> = Time extends number ? Type : never;
export interface ReturnValue<Time extends Date | number> {
    seconds: string;
    minutes: string;
    hours: string;
    days: string;
    remainingTime: number;
    start: CheckNumber<Time, () => void>;
    pause: () => CheckNumber<Time, () => void>;
    reset: CheckNumber<Time, (withBegin?: boolean, resetTime?: number) => void>;
    isPausing?: boolean;
    isPaused?: boolean;
    isCounting?: boolean;
}
export default function useTimer<T extends Date | number>(time: Date | number, options?: Options, deps?: DependencyList): ReturnValue<T>;
export {};
