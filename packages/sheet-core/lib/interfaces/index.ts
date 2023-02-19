import { config as BarSettingType } from '../toolBar/interface';

export type Align = 'left' | 'center' | 'right';
export type TextDecoration = 'underline' | 'line-through' | 'none';
export enum CellTypeEnum {
  text = 'text',
  url = 'url',
  image = 'image',
  richText = 'richText',
  number = 'number',
  date = 'date',
  money = 'money',
}

export interface CellStyle {
  textAlign?: Align;
  backgroundColor?: string;
  fontWeight?: string;
  fontColor?: string;
  fontSize?: number;
  font?: string;
  deleteLine?: boolean;
  underLine?: boolean;
  italic?: boolean;
}

export interface Cell {
  style: CellStyle;
  content: string;
  type: CellTypeEnum;
  isSpan?: boolean;
}

export interface rows {
  cells: Cell[];
}

export interface SpanCell extends Cell {
  span: [number, number]; // w, h
}

export interface ExcelConfig {
  w: number[];
  h: number[];
  cells: Cell[][];
  //               'row_column'
  spanCells: Record<string, SpanCell>;
}

export interface RenderCellProps {
  location: {
    row: number;
    column: number;
  };
  point: [number, number];
  cell: SpanCell;
  w: number;
  h: number;
}

export type RenderCellPropsNoLocation = Pick<RenderCellProps, 'point' | 'cell' | 'w' | 'h'>;

export interface BaseSheetSetting {
  dom: HTMLElement | string;
  devMode?: boolean;
  fps?: boolean;
  darkMode?: boolean | 'auto';
  readOnly?: boolean;
  message?: (v: { type: 'info' | 'success' | 'error' | 'warning'; message: string }) => void;
}

export type SheetSetting = Omit<BaseSheetSetting, 'dom'> & BarSettingType;
