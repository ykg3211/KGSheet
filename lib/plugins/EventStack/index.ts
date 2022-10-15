import { PluginTypeEnum } from "..";
import Base from "../../core/base/base";
import { excelConfig } from "../../interfaces";
import { CellCornerScopeType } from "../SelectAndInput/EditCellPlugin";
import SelectPowerPlugin from "../SelectAndInput/SelectPowerPlugin";
import BaseEventStack from "./base";
export enum EventType {
  CELLS_MOVE = 'cells_move',
  CELLS_CHANGE = 'cells_change',
  ADD_DELETE_ROW_COLUMN = 'add_delete_row_column',
}

export interface BaseCellChangeType {
  scope: CellCornerScopeType;
  pre_data: excelConfig;
  after_data: excelConfig;
}

export interface BaseCellsChangeEventStackType extends BaseCellChangeType {
  time_stamp: Date;
}

export interface BaseCellsMoveType {
  sourceData: BaseCellChangeType;
  targetData: BaseCellChangeType;
  time_stamp: Date;
}

export default class EventStack extends BaseEventStack {
  constructor(_this: Base) {
    super(_this);
  }

  public cells_change({
    scope,
    pre_data,
    after_data,
  }: BaseCellsChangeEventStackType, isReverse = false) {
    const after = isReverse ? pre_data : after_data;
    const pre = isReverse ? after_data : pre_data;

    Object.keys(pre.spanCells).forEach(spanCell => {
      delete this._this._data.spanCells[spanCell];
    })

    this._this._setDataByScope({
      scope,
      data: after
    });
    (this._this[PluginTypeEnum.SelectPowerPlugin] as SelectPowerPlugin)?.selectCells(scope);
  }

  public cellsChange({
    scope,
    pre_data,
    after_data,
  }: BaseCellsChangeEventStackType) {
    this.push([{
      type: EventType.CELLS_CHANGE,
      params: {
        scope,
        pre_data,
        after_data,
        time_stamp: new Date()
      }
    }])
  }

  public cellsMove({
    sourceData,
    targetData,
    time_stamp,
  }: BaseCellsMoveType) {
    this.push([{
      type: EventType.CELLS_CHANGE,
      params: {
        ...sourceData,
        time_stamp
      }
    }, {
      type: EventType.CELLS_CHANGE,
      params: {
        ...targetData,
        time_stamp
      }
    }])
  }
}