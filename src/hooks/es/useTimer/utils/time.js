export var pad = function pad(value) {
  return value >= 100 ? String(value) : "0".concat(Math.floor(value)).slice(-2);
};
export var getRemainingTime = function getRemainingTime(deadline) {
  var currentTime = Date.now();
  return deadline - currentTime;
};
export var formatTime = function formatTime(time) {
  var isAbs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var remainingTime = isAbs ? Math.abs(getRemainingTime(time)) : getRemainingTime(time);

  if (remainingTime < 0) {
    // 如果小于0，代表从其他tab切回来，时间已经过了endTime，所以直接显示0即可。
    return {
      remainingTime: 0,
      seconds: '00',
      minutes: '00',
      hours: '00',
      days: '00'
    };
  }

  var seconds = pad(Math.floor(remainingTime / 1000) % 60);
  var minutes = pad(Math.floor(remainingTime / (60 * 1000)) % 60);
  var hours = pad(Math.floor(remainingTime / (60 * 60 * 1000)) % 24);
  var days = pad(Math.floor(remainingTime / (24 * 60 * 60 * 1000)));
  return {
    remainingTime: remainingTime,
    seconds: seconds,
    minutes: minutes,
    hours: hours,
    days: days
  };
};