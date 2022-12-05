import { ExcelConfig, CellTypeEnum, Cell, CellStyle } from '../interfaces';
const BASE_WIDTH = 120;
const BASE_HEIGHT = 40;
export const splitSymbol = '_';
export const createDefaultStyle = () => {
  const result: CellStyle = {
    textAlign: 'left',
    fontSize: 18,
  };
  return result;
};
export const createDefaultCell = (content = '') => {
  const result: Cell = {
    style: createDefaultStyle(),
    content: content || '',
    type: CellTypeEnum.text,
  };
  return result;
};

const createDefaultData = (w: number = 10, h: number = 100) => {
  const result: ExcelConfig = {
    w: new Array(w).fill(BASE_WIDTH),
    h: new Array(h).fill(BASE_HEIGHT),
    cells: [],
    spanCells: {
      '2_3': {
        span: [2, 4],
        ...createDefaultCell('2, 3'),
      },
      // '6_3': {
      //   span: [2, 4],
      //   ...createDefaultCell('6, 3')
      // },
      // '2_5': {
      //   span: [2, 4],
      //   ...createDefaultCell('2, 5')
      // },
    },
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
