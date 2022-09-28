export interface ITimeStampedSet {
    add: (value: any) => void;
    has: (value: any) => boolean;
    clear: Function;
}
declare const TimeStampedSet: <T>(this: ITimeStampedSet, expireTime: number) => void;
export default TimeStampedSet;
