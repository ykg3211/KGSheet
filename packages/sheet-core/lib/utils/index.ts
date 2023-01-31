import { Cell, ExcelConfig } from '../interfaces';
import { SelectedCellType } from '../core/base/base';

type numbers2 = [number, number];
type numbers4 = [number, number, number, number];

export const isMacOS = (function () {
  return /macintosh|mac os x/i.test(navigator.userAgent);
})();

export const isSafari = (function () {
  return /Safari/.test(navigator.userAgent);
})();

export const META_KEY = isMacOS ? '⌘' : 'Ctrl';

export function nextTick(fn?: Function) {
  return new Promise((resolve) => {
    window.requestAnimationFrame(() => {
      fn?.();
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

// object 的比对函数
export function isSame(left?: Record<string, any>, right?: Record<string, any>) {
  if (!left || !right) {
    return left === right;
  }
  const rightKeys: Record<string, boolean> = {};
  let same = true;
  Object.keys(right).forEach((key) => {
    rightKeys[key] = true;
  });

  Object.keys(left).some((key) => {
    if (rightKeys[key]) {
      delete rightKeys[key];
      const l = left[key];
      const r = right[key];
      if (typeof l !== typeof r) {
        same = false;
        return true;
      } else {
        if (typeof l === 'object') {
          const tempSame = isSame(l, r);
          if (!tempSame) {
            same = false;
            return true;
          }
        } else {
          if (l !== r) {
            same = false;
            return true;
          }
        }
      }
    } else {
      same = false;
      return true;
    }
    return false;
  });

  if (Object.keys(rightKeys).length > 0) {
    return false;
  }

  return same;
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

export function throttleByRequestAnimationFrame(fn: Function) {
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

export const isSameArray: (array_1: Array<any>, array_2: Array<any>) => boolean = (array_1, array_2) => {
  let isSame = true;
  array_1.some((v, i) => {
    if (v !== array_2[i]) {
      isSame = false;
      return true;
    }
    return false;
  });
  return isSame;
};

export function throttle(func: any, t: number) {
  let ready: boolean = true;
  let time: null | number = null;
  return (...arg: any) => {
    if (time) {
      clearTimeout(time);
    }
    if (ready) {
      ready = false;
      func(...arg);
      setTimeout(() => {
        ready = true;
      }, t);
    } else {
      time = setTimeout(() => {
        func(...arg);
      }, t);
    }
  };
}

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

export function handleCell(
  source: ExcelConfig,
  trigger: (
    v: Cell,
    location: {
      row: number;
      column: number;
    },
  ) => Cell,
) {
  const target = deepClone(source);
  target.cells = target.cells.map((row, rowIndex) => {
    return row.map((cell, columnIndex) => {
      cell = trigger(cell, {
        row: rowIndex,
        column: columnIndex,
      });
      return cell;
    });
  });
  Object.keys(target.spanCells).forEach((key) => {
    // @ts-ignore
    target.spanCells[key] = trigger(target.spanCells[key]);
  });
  return target;
}

export function mapObject<T>(obj: Record<any, T>, cb: (v: T) => T) {
  Object.keys(obj).forEach((key) => {
    obj[key] = cb(obj[key]);
  });
}

export function clickOutSide(_dom: string | HTMLElement, e: MouseEvent) {
  let dom: HTMLElement | null;
  if (typeof _dom === 'string') {
    dom = document.getElementById(_dom) || (document.getElementsByClassName(_dom)[0] as HTMLElement) || null;
  } else {
    dom = _dom;
  }
  if (!dom) {
    return true;
  }

  let current = (e.target as HTMLElement) || null;
  while (current) {
    if (dom === current) {
      return false;
    }

    current = current.parentElement as HTMLElement;
  }
  return true;
}
