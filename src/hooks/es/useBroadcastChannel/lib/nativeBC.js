export function createChannel(channelName) {
  var channel = {
    channelInstance: new BroadcastChannel(channelName),
    messagesListener: undefined
  };

  channel.channelInstance.onmessage = function (message) {
    if (channel.messagesListener) {
      channel.messagesListener(message.data);
    }
  };

  return channel;
}
export function onChannelMessage(channel, fn) {
  channel.messagesListener = fn;
}
export function postChannelMessage(channel, messageJson) {
  channel.channelInstance.postMessage(messageJson);
}
export function closeChannel(channel) {
  channel.channelInstance.close();
}
export default {
  createChannel: createChannel,
  postChannelMessage: postChannelMessage,
  onChannelMessage: onChannelMessage,
  closeChannel: closeChannel
};