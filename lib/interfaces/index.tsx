export type align = 'left' | 'center' | 'right';
export enum CellTypeEnum {
  string,
  number,
  date,
  money
}

export interface cellStyle {
  align?: align;
  backgroundColor?: string;
  fontColor?: string
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