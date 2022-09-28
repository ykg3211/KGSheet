import { IStampedMessage } from './index';
export interface INativeChannel {
    channelInstance: BroadcastChannel;
    messagesListener?: Function;
}
export declare function createChannel(channelName: string): INativeChannel;
export declare function onChannelMessage(channel: INativeChannel, fn: Function): void;
export declare function postChannelMessage(channel: INativeChannel, messageJson: IStampedMessage): void;
export declare function closeChannel(channel: INativeChannel): void;
declare const _default: {
    createChannel: typeof createChannel;
    postChannelMessage: typeof postChannelMessage;
    onChannelMessage: typeof onChannelMessage;
    closeChannel: typeof closeChannel;
};
export default _default;
