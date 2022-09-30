import { excelConfig, CellTypeEnum, cell, cellStyle } from "../interfaces";
const BASE_WIDTH = 30;
const BASE_HEIGHT = 15;
const createDefaultStyle = () => {
  return {
    align: 'center',
    fontSize: 12

  } as cellStyle
}
const createDefaultCell = (_h: number, _w: number) => {
  return {
    style: createDefaultStyle(),
    content: _h + '-' + _w,
    type: CellTypeEnum.string
  } as cell
}

const createDefaultData = (w: number = 10, h: number = 100) => {
  const result: excelConfig = {
    w: new Array(w).fill(BASE_WIDTH),
    h: new Array(h).fill(BASE_HEIGHT),
    cells: []
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

  console.log(result)
  return result;
}

export default createDefaultData;