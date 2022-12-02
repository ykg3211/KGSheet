export type align = 'left' | 'center' | 'right';
export enum CellTypeEnum {
  text = 'text',
  richText = 'richText',
  number = 'number',
  date = 'date',
  money = 'money',
}

export interface CellStyle {
  textAlign?: align;
  backgroundColor?: string;
  fontWeight?: string;
  fontColor?: string;
  fontSize?: number;
  font?: string;
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
  point: number[];
  cell: SpanCell;
  w: number;
  h: number;
}

export type RenderCellPropsNoLocation = Pick<RenderCellProps, 'point' | 'cell' | 'w' | 'h'>;
