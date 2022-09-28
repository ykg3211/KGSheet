import { INativeChannel } from './nativeBC';
import { IWebChannel } from './indexdbBC';
interface IBroadcastChannel {
    createChannel: (channelName: string) => INativeChannel | Promise<IWebChannel>;
    postChannelMessage: Function;
    onChannelMessage: Function;
    closeChannel: Function;
}
export interface IStampedMessage {
    id?: number;
    channelId?: string;
    timeStamp: number;
    data: any;
}
export interface IStampedListener {
    timeStamp: number;
    listener: Function;
}
export default class _BroadcastChannel {
    channelName: string;
    _prepP: INativeChannel | Promise<IWebChannel> | null;
    _channel: INativeChannel | IWebChannel | null;
    _core: IBroadcastChannel;
    _isListening: boolean;
    subscribers: IStampedListener[];
    messageListener: IStampedListener | null;
    closed: boolean;
    constructor(channelName: string);
    set onmessage(listener: Function);
    postMessage(msg: any): Promise<any>;
    close(): Promise<any> | undefined;
    private createChannel;
    private _addSubscribers;
    private _removeDuplicateListener;
    private _stopListening;
}
export declare function isPromise(target: any): boolean;
export {};
