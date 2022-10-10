import { excelConfig, CellTypeEnum, cell, cellStyle } from "../interfaces";
const BASE_WIDTH = 120;
const BASE_HEIGHT = 40;
export const splitSymbol = '_';
const createDefaultStyle = () => {
  const result: cellStyle = {
    align: 'left',
    fontSize: 12,
  }
  return result;
}
const createDefaultCell = (_h: number, _w: number, content = '') => {
  const result: cell = {
    style: createDefaultStyle(),
    content: content ? content : _h + '-' + _w,
    type: CellTypeEnum.string,
  }
  return result;
}

const createDefaultData = (w: number = 10, h: number = 100) => {
  const result: excelConfig = {
    w: new Array(w).fill(BASE_WIDTH),
    h: new Array(h).fill(BASE_HEIGHT),
    cells: [],
    spanCells: {
      '1_5': {
        span: [1, 3],
        ...createDefaultCell(10, 10)
      },
      // '1_4': {
      //   span: [4, 3],
      //   ...createDefaultCell(10, 10)
      // },
    }
  }

  for (let _h = 0; _h < h; _h++) {
    const temp: cell[] = [];
    for (let _w = 0; _w < w; _w++) {
      temp.push(createDefaultCell(_h, _w));
    }
    result.cells.push({
      cells: temp
    });
  }

  return result;
}

export default createDefaultData;