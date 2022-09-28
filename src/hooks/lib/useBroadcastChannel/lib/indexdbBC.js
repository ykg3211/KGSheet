"use strict";

function _empty() {}

function _awaitIgnored(value, direct) {
  if (!direct) {
    return value && value.then ? value.then(_empty) : Promise.resolve();
  }
}

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sleep = sleep;
exports.writeMessagesToDB = writeMessagesToDB;
exports.readMessagesFromDB = readMessagesFromDB;
exports.readMessagesByTime = readMessagesByTime;
exports.onChannelMessage = onChannelMessage;
exports.closeChannel = closeChannel;
exports.default = exports.deleteExpiredMessages = exports.createChannel = exports.postChannelMessage = void 0;

var _timeStampedSet = _interopRequireDefault(require("./timeStampedSet"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _await(value, then, direct) {
  if (direct) {
    return then ? then(value) : value;
  }

  if (!value || !value.then) {
    value = Promise.resolve(value);
  }

  return then ? value.then(then) : value;
}

function _async(f) {
  return function () {
    for (var args = [], i = 0; i < arguments.length; i++) {
      args[i] = arguments[i];
    }

    try {
      return Promise.resolve(f.apply(this, args));
    } catch (e) {
      return Promise.reject(e);
    }
  };
}

function _call(body, then, direct) {
  if (direct) {
    return then ? then(body()) : body();
  }

  try {
    var result = Promise.resolve(body());
    return then ? result.then(then) : result;
  } catch (e) {
    return Promise.reject(e);
  }
}

var postChannelMessage = _async(function (channel, messageJson) {
  channel.writeDBPromise = channel.writeDBPromise.then(function () {
    return writeMessagesToDB(channel, messageJson);
  }).then(function () {
    deleteExpiredMessages(channel.db, 1000 * 60 * 2);
  });
  return channel.writeDBPromise;
});

exports.postChannelMessage = postChannelMessage;

var createChannel = _async(function (channelName) {
  var dbName = DB_PREFIX + channelName;
  var openRequest = indexedDB.open(dbName, 1);

  openRequest.onupgradeneeded = function (ev) {
    var db = ev.target.result;
    db.createObjectStore(OBJECT_STORE_ID, {
      keyPath: 'id',
      autoIncrement: true
    });
  };

  var dbPromise = function dbPromise() {
    return new Promise(function (resolve, reject) {
      openRequest.onerror = function (ev) {
        return reject(ev);
      };

      openRequest.onsuccess = function () {
        resolve(openRequest.result);
      };
    });
  };

  return _call(dbPromise, function (db) {
    var channel = {
      channelName: channelName,
      channelId: Math.random().toString(36).substring(2),
      closed: false,
      lastCursorId: 0,
      emittedMessages: new _timeStampedSet.default(1000 * 45 * 2),
      writeDBPromise: Promise.resolve(),
      messagesListener: function messagesListener() {
        return undefined;
      },
      db: db
    };
    syncMessages(channel);
    return channel;
  });
});

exports.createChannel = createChannel;

var syncSubscribers = _async(function (channel) {
  return channel.closed || !channel.messagesListener ? Promise.resolve() : _await(readMessagesFromDB(channel), function (messages) {
    messages.forEach(function (message) {
      if (channel.messagesListener) {
        channel.emittedMessages.add(message.id);
        channel.messagesListener(message.data);
      }
    });
    return Promise.resolve();
  });
});

var syncMessages = _async(function (channel) {
  if (channel.closed) return;
  return _awaitIgnored(syncSubscribers(channel).then(function () {
    return sleep(150);
  }).then(function () {
    return syncMessages(channel);
  }));
});

var deleteExpiredMessages = _async(function (db, expireTime) {
  return _await(readMessagesByTime(db, expireTime), function (expiredMessages) {
    Promise.all(expiredMessages.map(function (message) {
      return deleteMessageFromDB(db, message.id);
    }));
  });
});

exports.deleteExpiredMessages = deleteExpiredMessages;
var DB_PREFIX = 'MESSAGE_DB';
var OBJECT_STORE_ID = 'MESSAGE_STORE';

function sleep(time) {
  time = time || 0;
  return new Promise(function (resolve) {
    return setTimeout(resolve, time);
  });
}

function writeMessagesToDB(channel, messageJson) {
  var db = channel.db,
      channelId = channel.channelId;
  var timeStamp = new Date().getTime();
  var writeObject = {
    channelId: channelId,
    timeStamp: timeStamp,
    data: messageJson
  };
  var transaction = db.transaction([OBJECT_STORE_ID], 'readwrite');
  return new Promise(function (resolve, rej) {
    transaction.oncomplete = function () {
      return resolve();
    };

    transaction.onerror = function (ev) {
      return rej(ev);
    };

    var objectStore = transaction.objectStore(OBJECT_STORE_ID);
    objectStore.add(writeObject);
  });
}

function readMessagesFromDB(channel) {
  var db = channel.db,
      lastCursorId = channel.lastCursorId;
  var objectStore = db.transaction(OBJECT_STORE_ID).objectStore(OBJECT_STORE_ID);
  var ret = [];
  var keyRangeValue = IDBKeyRange.bound(lastCursorId + 1, Infinity);
  return new Promise(function (resolve) {
    objectStore.openCursor(keyRangeValue).onsuccess = function (ev) {
      var cursor = ev.target.result;

      if (cursor) {
        ret.push(cursor.value);
        cursor.continue();
      } else {
        resolve(ret.map(function (message) {
          if (message.id > channel.lastCursorId) {
            channel.lastCursorId = message.id;
          }

          return message;
        }).filter(function (message) {
          if (message.channelId === channel.channelId || channel.emittedMessages.has(message.id) || message.data.timeStamp < channel.listenerStamp) {
            return false;
          }

          return true;
        }).sort(function (msgObjA, msgObjB) {
          return msgObjA.timeStamp - msgObjB.timeStamp;
        }));
      }
    };
  });
}

function readMessagesByTime(db, expireTime) {
  var olderThen = new Date().getTime() - expireTime;
  var objectStore = db.transaction(OBJECT_STORE_ID).objectStore(OBJECT_STORE_ID);
  var ret = [];
  return new Promise(function (resolve) {
    objectStore.openCursor().onsuccess = function (ev) {
      var cursor = ev.target.result;

      if (cursor) {
        var message = cursor.value;

        if (message.timeStamp < olderThen) {
          ret.push(message);
          cursor.continue();
        } else {
          resolve(ret);
        }
      } else {
        resolve(ret);
      }
    };
  });
}

function deleteMessageFromDB(db, id) {
  var request = db.transaction([OBJECT_STORE_ID], 'readwrite').objectStore(OBJECT_STORE_ID).delete(id);
  return new Promise(function (resolve) {
    request.onsuccess = function () {
      return resolve();
    };
  });
}

function onChannelMessage(channel, fn, timeStamp) {
  channel.listenerStamp = timeStamp;
  channel.messagesListener = fn;
  syncSubscribers(channel);
}

function closeChannel(channel) {
  channel.closed = true;
  channel.db.close();
}

var _default = {
  createChannel: createChannel,
  postChannelMessage: postChannelMessage,
  onChannelMessage: onChannelMessage,
  closeChannel: closeChannel
};
exports.default = _default;