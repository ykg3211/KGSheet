import { selectedCellType } from "../core/base/base";

export function nextTick(fn: Function) {
  return new Promise(resolve => {
    window.requestAnimationFrame(() => {
      fn();
      resolve(null);
    })
  })
}

export function isNN(v: any) {
  return v === undefined || v === null
}

// 判断一颗点是不是在方形内
export function judgeOver([_x, _y], [x, y, w, h]) {
  return _x >= x && _x <= x + w && _y >= y && _y <= y + h;
}

// 判断两个方有没有相交
export function judgeCross([_x, _y, _w, _h], [x, y, w, h]) {
  return !(_x + _w <= x || _x >= x + w || _y + _h <= y || _y >= y + h);
}

export function judgeInner([_x, _y, _w, _h], [x, y, w, h]) {
  return _x >= x && _y >= y && _x + _w <= x + w && _y + _h <= y + h;
}

export function combineRect([_x, _y, _w, _h], [x, y, w, h]) {
  const startPoint = [Math.min(_x, x), Math.min(_y, y)];
  const endPoint = [Math.max(_x + _w, x + w), Math.max(_y + _h, y + h)];

  return [startPoint[0], startPoint[1], endPoint[0] - startPoint[0], endPoint[1] - startPoint[1]]
}

export function combineCell(cells: selectedCellType[]) {
  const leftTopCell: selectedCellType = {
    row: Infinity,
    column: Infinity
  };
  const rightBottomCell: selectedCellType = {
    row: -Infinity,
    column: -Infinity
  };
  cells.forEach(cell => {
    leftTopCell.row = Math.min(leftTopCell.row, cell.row);
    leftTopCell.column = Math.min(leftTopCell.column, cell.column);

    rightBottomCell.row = Math.max(rightBottomCell.row, cell.row);
    rightBottomCell.column = Math.max(rightBottomCell.column, cell.column);
  })

  return {
    leftTopCell,
    rightBottomCell
  }
}

export function _throttleByRequestAnimationFrame(fn: Function) {
  let flag = true;
  return (...arg) => {
    if (flag) {
      flag = false;
      nextTick(() => {
        flag = true;
        fn(...arg);
      })
    }
  }
}

export const deepClone: <T>(raw: T) => T = (v: any) => {
  return v ? JSON.parse(JSON.stringify(v)) : v;
}

export function debounce(func: any, t: number) {
  let time: null | number = null;
  return (...arg) => {
    if (time) {
      clearTimeout(time);
    }
    time = setTimeout(() => {
      func(...arg);
    }, t);
  }
}