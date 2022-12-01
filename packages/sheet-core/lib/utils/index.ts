import { cell, excelConfig } from '../interfaces';
import { SelectedCellType } from '../core/base/base';

type numbers2 = [number, number];
type numbers4 = [number, number, number, number];

export function nextTick(fn: Function) {
  return new Promise((resolve) => {
    window.requestAnimationFrame(() => {
      fn();
      resolve(null);
    });
  });
}

export function isNN(v: any) {
  return v === undefined || v === null;
}

// 判断一颗点是不是在方形内
export function judgeOver([_x, _y]: numbers2, [x, y, w, h]: numbers4) {
  return _x >= x && _x <= x + w && _y >= y && _y <= y + h;
}

// 判断两个方有没有相交
export function judgeCross([_x, _y, _w, _h]: numbers4, [x, y, w, h]: numbers4) {
  return !(_x + _w <= x || _x >= x + w || _y + _h <= y || _y >= y + h);
}

export function judgeInner([_x, _y, _w, _h]: numbers4, [x, y, w, h]: numbers4) {
  return _x >= x && _y >= y && _x + _w <= x + w && _y + _h <= y + h;
}

export function combineRect([_x, _y, _w, _h]: numbers4, [x, y, w, h]: numbers4) {
  const startPoint = [Math.min(_x, x), Math.min(_y, y)];
  const endPoint = [Math.max(_x + _w, x + w), Math.max(_y + _h, y + h)];

  return [startPoint[0], startPoint[1], endPoint[0] - startPoint[0], endPoint[1] - startPoint[1]];
}

// 合并所有的cell成一个大cell
export function combineCell(cells: SelectedCellType[]) {
  const leftTopCell: SelectedCellType = {
    row: Infinity,
    column: Infinity,
  };
  const rightBottomCell: SelectedCellType = {
    row: -Infinity,
    column: -Infinity,
  };
  cells.forEach((cell) => {
    leftTopCell.row = Math.min(leftTopCell.row, cell.row);
    leftTopCell.column = Math.min(leftTopCell.column, cell.column);

    rightBottomCell.row = Math.max(rightBottomCell.row, cell.row);
    rightBottomCell.column = Math.max(rightBottomCell.column, cell.column);
  });

  return {
    leftTopCell,
    rightBottomCell,
  };
}

export function _throttleByRequestAnimationFrame(fn: Function) {
  let flag = true;
  return (...arg: any) => {
    if (flag) {
      flag = false;
      nextTick(() => {
        flag = true;
        fn(...arg);
      });
    }
  };
}

export const deepClone: <T>(raw: T) => T = (v: any) => {
  return v ? JSON.parse(JSON.stringify(v)) : v;
};

export function debounce(func: any, t: number) {
  let time: null | number = null;
  return (...arg: any) => {
    if (time) {
      clearTimeout(time);
    }
    time = setTimeout(() => {
      func(...arg);
    }, t);
  };
}

export function getABC(num: number): string {
  const result: number[] = [];
  if (num === 0) {
    return 'A';
  }
  while (num > 0) {
    const temp = num % 26;
    num -= temp;
    num = num / 26;
    result.unshift(temp);
  }
  return result.map((i) => String.fromCharCode(i + 65)).join('');
}

export function handleCell(source: excelConfig, trigger: (v: cell) => cell) {
  const target = deepClone(source);
  target.cells = target.cells.map((row) => {
    return row.map((cell) => {
      cell = trigger(cell);
      return cell;
    });
  });
  return target;
}
