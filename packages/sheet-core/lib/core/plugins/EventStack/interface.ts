import { Cell, ExcelConfig } from '../../../interfaces';
import { CellCornerScopeType } from '../SelectAndInput/EditCellPlugin';

export interface BaseStepType {
  time_stamp?: Date;
}

export interface BaseCellChangeType extends BaseStepType {
  scope: CellCornerScopeType;
  pre_data: ExcelConfig;
  after_data: ExcelConfig;
}

export interface BaseCellsMoveType extends BaseStepType {
  pre_data: BaseCellChangeType;
  after_data: BaseCellChangeType;
}

export interface BaseAddRemoveRowsColumnsType extends BaseStepType {
  isAdd: boolean;
  isRow: boolean;
  index: number;
  excel: ExcelConfig;
}

export interface RowColumnResizeType extends BaseStepType {
  isRow: boolean;
  index: number;
  preWidth: number;
  afterWidth: number;
}
