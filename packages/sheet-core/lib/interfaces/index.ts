export type align = 'left' | 'center' | 'right';
export enum CellTypeEnum {
  text = 'text',
  richText = 'richText',
  number = 'number',
  date = 'date',
  money = 'money'
}

export interface cellStyle {
  textAlign?: align;
  backgroundColor?: string;
  fontColor?: string;
  fontSize?: number;
  font?: string;
}
export interface cell {
  style: cellStyle;
  content: string;
  type: CellTypeEnum;
  isSpan?: boolean;
}
export interface rows {
  cells: cell[];
}

export interface spanCell extends cell {
  span: [number, number] // w, h
}

export interface excelConfig {
  w: number[];
  h: number[];
  cells: cell[][];
  //               'row_column'
  spanCells: Record<string, spanCell>
}

export interface renderCellProps {
  location: {
    row: number,
    column: number,
  },
  point: number[];
  cell: spanCell;
  w: number;
  h: number;
}

export interface renderBarProps {
  point: number[];
  cell: cell;
  w: number;
  h: number;
}