export function isNN(v: any) {
  return v === undefined || v === null
}

export function judgeOver([_x, _y], [x, y, w, h]) {
  return _x > x && _x < x + w && _y > y && _y < y + h;
}

export function judgeCross([_x, _y, _w, _h], [x, y, w, h]) {
  return !(_x + _w <= x || _x >= x + w || _y + _h <= y || _y >= y + h)
}

export function combineRect([_x, _y, _w, _h], [x, y, w, h]) {
  const startPoint = [Math.min(_x, x), Math.min(_y, y)];
  const endPoint = [Math.max(_x + _w, x + w), Math.max(_y + _h, y + h)];

  return [startPoint[0], startPoint[1], endPoint[0] - startPoint[0], endPoint[1] - startPoint[1]]
}

export function _throttleByRequestAnimationFrame(fn: Function, t: number = 0) {
  let flag = true;
  return () => {
    if (flag) {
      flag = false;
      fn();
      window.requestAnimationFrame(() => {
        flag = true;
      })
    }
  }
}