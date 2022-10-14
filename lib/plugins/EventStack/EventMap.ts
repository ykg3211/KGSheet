import { PluginTypeEnum } from "..";
import Base from "../../core/base/base";
import { excelConfig } from "../../interfaces";
import { CellCornerScopeType } from "../SelectAndInput/EditCellPlugin";
export enum EventType {
  CELLS_CHANGE = 'cells_change',
  ADD_DELETE_ROW_COLUMN = 'add_delete_row_column',
}

export interface BaseCellsChangeType {
  scope: CellCornerScopeType;
  pre_data: excelConfig;
  after_data: excelConfig;
  time_stamp: Date;
}

export default class EventMap {
  private _this: Base;
  public name: string;
  public EVENT_MAP: Record<EventType, () => void>
  constructor(_this: Base) {
    this._this = _this;
    this.name = PluginTypeEnum.EventStack;

    this.EVENT_MAP = {}
  }
}