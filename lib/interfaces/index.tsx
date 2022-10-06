export type align = 'left' | 'center' | 'right';
export enum CellTypeEnum {
  string = 'string',
  number = 'number',
  date = 'date',
  money = 'money'
}

export interface cellStyle {
  align?: align;
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
  span: [number, number]
}

export interface excelConfig {
  w: number[];
  h: number[];
  cells: rows[];
  spanCells?: Record<string, spanCell>
}

export interface renderCellProps {
  point: number[];
  cell: cell;
  w: number;
  h: number;
}