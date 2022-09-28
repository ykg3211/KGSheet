"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/* eslint-disable space-before-function-paren */

/* eslint-disable func-names */
var TimeStampedSet = function TimeStampedSet(expireTime) {
  var valueSet = new Set();
  var timestampMap = new Map();

  this.add = function (value) {
    timestampMap.set(value, getTime());
    valueSet.add(value);
    deleteExpiredValues(expireTime);
  };

  this.has = valueSet.has.bind(valueSet);

  this.clear = function () {
    valueSet.clear();
    timestampMap.clear();
  };

  function deleteExpiredValues(expireTime) {
    var currentTimeStamp = getTime();
    var iterator = valueSet[Symbol.iterator]();

    while (true) {
      var _iterator$next = iterator.next(),
          _value = _iterator$next.value;

      if (!_value) return;
      var timeStamp = timestampMap.get(_value);

      if (currentTimeStamp - timeStamp > expireTime) {
        timestampMap.delete(_value);
        valueSet.delete(_value);
      } else {
        return;
      }
    }
  }
};

function getTime() {
  return new Date().getTime();
}

var _default = TimeStampedSet;
exports.default = _default;