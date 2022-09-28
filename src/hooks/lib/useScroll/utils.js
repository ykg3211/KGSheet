"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDirectionX = getDirectionX;
exports.getDirectionY = getDirectionY;
exports.getTotalDistanceX = getTotalDistanceX;
exports.getTotalDistanceY = getTotalDistanceY;
exports.getRelativeDistanceX = getRelativeDistanceX;
exports.getRelativeDistanceY = getRelativeDistanceY;
exports.getSpeedX = getSpeedX;
exports.getSpeedY = getSpeedY;
exports.DEFAULT_TIMEOUT = exports.INITIAL_DATA = void 0;
var INITIAL_DATA = {
  scrolling: false,
  time: 0,
  direction: {
    x: null,
    y: null
  },
  speed: {
    x: 0,
    y: 0
  },
  totalDistance: {
    x: 0,
    y: 0
  },
  relativeDistance: {
    x: 0,
    y: 0
  },
  offset: {
    x: 0,
    y: 0
  }
};
exports.INITIAL_DATA = INITIAL_DATA;
var DEFAULT_TIMEOUT = 100;
exports.DEFAULT_TIMEOUT = DEFAULT_TIMEOUT;

function getDirectionX(x, toData) {
  if (x > toData.offset.x) return 'right';
  if (x < toData.offset.x) return 'left';
  return null;
}

function getDirectionY(y, toData) {
  if (y > toData.offset.y) return 'down';
  if (y < toData.offset.y) return 'up';
  return null;
}

function getTotalDistanceX(x, toData) {
  return toData.totalDistance.x + Math.abs(x - toData.offset.x);
}

function getTotalDistanceY(y, toData) {
  return toData.totalDistance.y + Math.abs(y - toData.offset.y);
}

function getRelativeDistanceX(x, fromData) {
  return Math.abs(x - fromData.offset.x);
}

function getRelativeDistanceY(y, fromData) {
  return Math.abs(y - fromData.offset.y);
}

function getSpeedX(x, toData, timestampDiff) {
  return Math.abs(toData.offset.x - x) / Math.max(1, timestampDiff) * 1000;
}

function getSpeedY(y, toData, timestampDiff) {
  return Math.abs(toData.offset.y - y) / Math.max(1, timestampDiff) * 1000;
}