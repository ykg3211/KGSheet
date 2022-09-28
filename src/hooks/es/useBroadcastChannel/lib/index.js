function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

import NativeBroadcastChannel from './nativeBC';
import IndexDbBroadcastChannel from './indexdbBC';
import { getTimeStamp } from './util';

var _BroadcastChannel = /*#__PURE__*/function () {
  function _BroadcastChannel(channelName) {
    _classCallCheck(this, _BroadcastChannel);

    this.channelName = void 0;
    this._prepP = void 0;
    this._channel = void 0;
    this._core = void 0;
    this._isListening = void 0;
    this.subscribers = void 0;
    this.messageListener = void 0;
    this.closed = void 0;
    this.channelName = channelName;
    this._core = NativeBroadcastChannel;
    this._prepP = null;
    this._channel = null;
    this._isListening = false;
    this.messageListener = null;
    this.subscribers = [];
    this.closed = false;
    this.createChannel();
  }

  _createClass(_BroadcastChannel, [{
    key: "onmessage",
    set: function set(listener) {
      var timeStamp = getTimeStamp();
      var stampedListener = {
        timeStamp: timeStamp,
        listener: listener
      };
      this.messageListener = stampedListener;

      this._addSubscribers(stampedListener);
    }
  }, {
    key: "postMessage",
    value: function postMessage(msg) {
      var _this = this;

      if (this.closed) {
        throw new Error('[hooks/useBroadcastChannel] Cannot post message after channel has closed');
      }

      var timeStamp = getTimeStamp();
      var stampedMessage = {
        timeStamp: timeStamp,
        data: msg
      };
      return (this._prepP || Promise.resolve()).then(function () {
        return _this._core.postChannelMessage(_this._channel, stampedMessage);
      });
    }
  }, {
    key: "close",
    value: function close() {
      var _this2 = this;

      if (this.closed) return;
      this.closed = true;
      this.messageListener = null;
      this.subscribers = [];
      return (this._prepP || Promise.resolve()).then(function () {
        return _this2._core.closeChannel(_this2._channel);
      });
    }
  }, {
    key: "createChannel",
    value: function createChannel() {
      var _this3 = this;

      this._core = chooseRealization();

      var createChannelAction = this._core.createChannel(this.channelName);

      if (isPromise(createChannelAction)) {
        this._prepP = createChannelAction;
        createChannelAction.then(function (c) {
          _this3._channel = c;
        });
      } else {
        this._channel = createChannelAction;
      }
    }
  }, {
    key: "_addSubscribers",
    value: function _addSubscribers(stampedListener) {
      var _this4 = this;

      this._removeDuplicateListener(this.messageListener);

      this.subscribers.push(stampedListener);

      if (this._isListening) {
        return;
      }

      var listenerFn = function listenerFn(stampedMessage) {
        _this4.subscribers.forEach(function (_stampedListener) {
          if (stampedMessage.timeStamp >= _stampedListener.timeStamp) {
            _stampedListener.listener(stampedMessage.data);
          }
        });
      };

      if (this._prepP) {
        this._prepP.then(function () {
          _this4._isListening = true;

          _this4._core.onChannelMessage(_this4._channel, listenerFn);
        });
      } else {
        this._isListening = true;

        this._core.onChannelMessage(this._channel, listenerFn);
      }
    }
  }, {
    key: "_removeDuplicateListener",
    value: function _removeDuplicateListener(listener) {
      this.subscribers = this.subscribers.filter(function (s) {
        return s !== listener;
      });

      this._stopListening();
    }
  }, {
    key: "_stopListening",
    value: function _stopListening() {
      if (this._isListening && this.subscribers.length <= 0) {
        this._isListening = false;

        this._core.onChannelMessage(this._channel, null);
      }
    }
  }]);

  return _BroadcastChannel;
}();

export { _BroadcastChannel as default };

function chooseRealization() {
  var checkNativeAvailable = function checkNativeAvailable() {
    if (typeof BroadcastChannel === 'function') {
      return true;
    }

    return false;
  };

  var checkIndexDBAvailable = function checkIndexDBAvailable() {
    if (typeof indexedDB !== 'undefined') return true;
    return false;
  };

  if (checkNativeAvailable()) {
    return NativeBroadcastChannel;
  }

  if (checkIndexDBAvailable()) {
    return IndexDbBroadcastChannel;
  }

  throw new Error('[hooks/useBroadcastChannel] No useable method found');
}

export function isPromise(target) {
  if (target && typeof target.then === 'function') {
    return true;
  }

  return false;
}