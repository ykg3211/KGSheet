import { judgeCellType } from '.';
import { ExcelConfig, Cell, CellStyle, CellTypeEnum } from '../interfaces';
export const BASE_WIDTH = 120;
export const BASE_HEIGHT = 40;
export const splitSymbol = '_';
export const createDefaultStyle = () => {
  const result: CellStyle = {
    textAlign: 'left',
    fontSize: 18,
  };
  return result;
};

export const createDefaultCell = (content = '', cellType?: CellTypeEnum) => {
  const result: Cell = {
    style: createDefaultStyle(),
    content: content || '',
    type: cellType || judgeCellType({ content, type: cellType || 'text' } as any),
  };
  return result;
};

const createDefaultData = (w: number = 10, h: number = 100) => {
  const result: ExcelConfig = {
    w: new Array(w).fill(BASE_WIDTH),
    h: new Array(h).fill(BASE_HEIGHT),
    cells: [],
    spanCells: {},
  };

  for (let _h = 0; _h < h; _h++) {
    const temp: Cell[] = [];
    for (let _w = 0; _w < w; _w++) {
      // temp.push(createDefaultCell(_h + '_' + _w));
      temp.push(createDefaultCell());
    }
    result.cells.push(temp);
  }
  return result;
};

export default createDefaultData;
