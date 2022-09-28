import { IStampedMessage } from './index';
export interface IWebChannel {
    channelName: string;
    channelId: string;
    closed: boolean;
    lastCursorId: number;
    emittedMessages: any;
    writeDBPromise: Promise<any>;
    messagesListener: Function;
    db: IDBDatabase;
    listenerStamp?: number;
}
export declare function sleep(time: number): Promise<unknown>;
export declare function writeMessagesToDB(channel: IWebChannel, messageJson: IStampedMessage): Promise<unknown>;
export declare function readMessagesFromDB(channel: IWebChannel): Promise<IStampedMessage[]>;
export declare function readMessagesByTime(db: IDBDatabase, expireTime: number): Promise<unknown>;
export declare function deleteExpiredMessages(db: IDBDatabase, expireTime: number): Promise<void>;
export declare function createChannel(channelName: string): Promise<{
    channelName: string;
    channelId: string;
    closed: boolean;
    lastCursorId: number;
    emittedMessages: any;
    writeDBPromise: Promise<void>;
    messagesListener: () => undefined;
    db: IDBDatabase;
}>;
export declare function onChannelMessage(channel: IWebChannel, fn: Function, timeStamp: number): void;
export declare function postChannelMessage(channel: IWebChannel, messageJson: IStampedMessage): Promise<any>;
export declare function closeChannel(channel: IWebChannel): void;
declare const _default: {
    createChannel: typeof createChannel;
    postChannelMessage: typeof postChannelMessage;
    onChannelMessage: typeof onChannelMessage;
    closeChannel: typeof closeChannel;
};
export default _default;
