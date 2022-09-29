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
  style: cellStyle,
  content: string;
  type: CellTypeEnum
}
export interface rows {
  cells: cell[]
}
export interface excelConfig {
  w: number[];
  h: number[];
  cells: rows[];
}

export interface renderCellProps {
  point: number[],
  cell: cell,
  w: number,
  h: number
}