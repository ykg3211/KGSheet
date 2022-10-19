import { excelConfig, CellTypeEnum, cell, cellStyle } from "../interfaces";
const BASE_WIDTH = 120;
const BASE_HEIGHT = 40;
export const splitSymbol = '_';
const createDefaultStyle = () => {
  const result: cellStyle = {
    fontColor: 'lightgray',
    align: 'right',
    fontSize: 18,
  }
  return result;
}
export const createDefaultCell = (content = '', _h?: number, _w?: number) => {
  const result: cell = {
    style: createDefaultStyle(),
    content: content || (_h + '_' + _w),
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
      '2_3': {
        span: [2, 4],
        ...createDefaultCell('', 2, 3)
      },
      '6_3': {
        span: [2, 4],
        ...createDefaultCell('', 6, 3)
      },
      '2_5': {
        span: [2, 4],
        ...createDefaultCell('', 2, 5)
      },
    }
  }

  for (let _h = 0; _h < h; _h++) {
    const temp: cell[] = [];
    for (let _w = 0; _w < w; _w++) {
      temp.push(createDefaultCell('', _h, _w));
    }
    result.cells.push(temp);
  }

  return result;
}

export default createDefaultData;