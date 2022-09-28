export var INITIAL_DATA = {
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
export var DEFAULT_TIMEOUT = 100;
export function getDirectionX(x, toData) {
  if (x > toData.offset.x) return 'right';
  if (x < toData.offset.x) return 'left';
  return null;
}
export function getDirectionY(y, toData) {
  if (y > toData.offset.y) return 'down';
  if (y < toData.offset.y) return 'up';
  return null;
}
export function getTotalDistanceX(x, toData) {
  return toData.totalDistance.x + Math.abs(x - toData.offset.x);
}
export function getTotalDistanceY(y, toData) {
  return toData.totalDistance.y + Math.abs(y - toData.offset.y);
}
export function getRelativeDistanceX(x, fromData) {
  return Math.abs(x - fromData.offset.x);
}
export function getRelativeDistanceY(y, fromData) {
  return Math.abs(y - fromData.offset.y);
}
export function getSpeedX(x, toData, timestampDiff) {
  return Math.abs(toData.offset.x - x) / Math.max(1, timestampDiff) * 1000;
}
export function getSpeedY(y, toData, timestampDiff) {
  return Math.abs(toData.offset.y - y) / Math.max(1, timestampDiff) * 1000;
}