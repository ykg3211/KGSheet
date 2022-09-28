import { excelConfig, CellTypeEnum, cell, cellStyle } from "../../interfaces";
const BASE_HEIGHT = 20;
const BASE_WIDTH = 100;
const createDefaultStyle = () => {
  return {
    align: 'left'
  } as cellStyle
}
const createDefaultCell = (_h: number, _w: number) => {
  return {
    style: createDefaultStyle(),
    align: 'left',
    content: _h + '-' + _w,
    type: CellTypeEnum.string
  } as cell
}

const createBaseConfig = (w: number = 10, h: number = 100) => {
  const result: excelConfig = {
    w: new Array(w).fill(BASE_WIDTH),
    h: new Array(h).fill(BASE_HEIGHT),
    cells: []
  }

  for (let _h = 0; _h < h; _h++) {
    const temp = [];
    for (let _w = 0; _w < w; _w++) {
      temp.push(createDefaultCell(_h, _w));
    }
    result.cells.push({
      cells: temp
    });
  }

  return result;
}

export default createBaseConfig;