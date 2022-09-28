"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createChannel = createChannel;
exports.onChannelMessage = onChannelMessage;
exports.postChannelMessage = postChannelMessage;
exports.closeChannel = closeChannel;
exports.default = void 0;

function createChannel(channelName) {
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

function onChannelMessage(channel, fn) {
  channel.messagesListener = fn;
}

function postChannelMessage(channel, messageJson) {
  channel.channelInstance.postMessage(messageJson);
}

function closeChannel(channel) {
  channel.channelInstance.close();
}

var _default = {
  createChannel: createChannel,
  postChannelMessage: postChannelMessage,
  onChannelMessage: onChannelMessage,
  closeChannel: closeChannel
};
exports.default = _default;